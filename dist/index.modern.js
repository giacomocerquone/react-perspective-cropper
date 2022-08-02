import React, { useCallback, Fragment, useRef, useEffect, useState, useImperativeHandle } from 'react';
import { useOpenCv, OpenCvProvider } from 'opencv-react';
import T from 'prop-types';
import Draggable from 'react-draggable';

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

var readFile = function readFile(file) {
  if (file instanceof File) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();

      reader.onload = function (event) {
        resolve(reader.result);
      };

      reader.onerror = function (err) {
        reject(err);
      };

      reader.readAsDataURL(file);
    });
  }

  if (typeof file === 'string') {
    return Promise.resolve(file);
  }
};
var calcDims = function calcDims(width, height, externalMaxWidth, externalMaxHeight) {
  var ratio = width / height;
  var maxWidth = externalMaxWidth || window.innerWidth;
  var maxHeight = externalMaxHeight || window.innerHeight;
  var calculated = {
    width: maxWidth,
    height: Math.round(maxWidth / ratio),
    ratio: ratio
  };

  if (calculated.height > maxHeight) {
    calculated.height = maxHeight;
    calculated.width = Math.round(maxHeight * ratio);
  }

  return calculated;
};
function isCrossOriginURL(url) {
  var _window = window,
      location = _window.location;
  var parts = url.match(/^(\w+:)\/\/([^:/?#]*):?(\d*)/i);
  return parts !== null && (parts[1] !== location.protocol || parts[2] !== location.hostname || parts[3] !== location.port);
}

var buildCropPointStyle = function buildCropPointStyle(size, pointBgColor, pointBorder) {
  return {
    width: size,
    height: size,
    backgroundColor: pointBgColor,
    border: pointBorder,
    borderRadius: '100%',
    position: 'absolute',
    zIndex: 1001
  };
};

var CropPoint = function CropPoint(_ref) {
  var cropPoints = _ref.cropPoints,
      pointArea = _ref.pointArea,
      defaultPosition = _ref.defaultPosition,
      pointSize = _ref.pointSize,
      _ref$pointBgColor = _ref.pointBgColor,
      pointBgColor = _ref$pointBgColor === void 0 ? 'transparent' : _ref$pointBgColor,
      _ref$pointBorder = _ref.pointBorder,
      pointBorder = _ref$pointBorder === void 0 ? '4px solid #3cabe2' : _ref$pointBorder,
      externalOnStop = _ref.onStop,
      externalOnDrag = _ref.onDrag,
      bounds = _ref.bounds;
  var onDrag = useCallback(function (_, position) {
    externalOnDrag(_extends({}, position, {
      x: position.x + pointSize / 2,
      y: position.y + pointSize / 2
    }), pointArea);
  }, [externalOnDrag]);
  var onStop = useCallback(function (_, position) {
    externalOnStop(_extends({}, position, {
      x: position.x + pointSize / 2,
      y: position.y + pointSize / 2
    }), pointArea, cropPoints);
  }, [externalOnDrag, cropPoints]);
  return /*#__PURE__*/React.createElement(Draggable, {
    bounds: bounds,
    defaultPosition: defaultPosition,
    position: {
      x: cropPoints[pointArea].x - pointSize / 2,
      y: cropPoints[pointArea].y - pointSize / 2
    },
    onDrag: onDrag,
    onStop: onStop
  }, /*#__PURE__*/React.createElement("div", {
    style: buildCropPointStyle(pointSize, pointBgColor, pointBorder)
  }));
};
CropPoint.propTypes = {
  cropPoints: T.shape({
    'left-top': T.shape({
      x: T.number,
      y: T.number
    }).isRequired,
    'right-top': T.shape({
      x: T.number,
      y: T.number
    }).isRequired,
    'right-bottom': T.shape({
      x: T.number,
      y: T.number
    }).isRequired,
    'left-bottom': T.shape({
      x: T.number,
      y: T.number
    }).isRequired
  }),
  pointArea: T.oneOf(['left-top', 'right-top', 'right-bottom', 'left-bottom']),
  defaultPosition: T.shape({
    x: T.number,
    y: T.number
  }),
  pointSize: T.number,
  pointBgColor: T.string,
  pointBorder: T.string,
  onStop: T.func,
  onDrag: T.func
};

var CropPoints = function CropPoints(props) {
  var previewDims = props.previewDims,
      otherProps = _objectWithoutPropertiesLoose(props, ["previewDims"]);

  return /*#__PURE__*/React.createElement(Fragment, null, /*#__PURE__*/React.createElement(CropPoint, _extends({
    pointArea: "left-top",
    defaultPosition: {
      x: 0,
      y: 0
    }
  }, otherProps)), /*#__PURE__*/React.createElement(CropPoint, _extends({
    pointArea: "right-top",
    defaultPosition: {
      x: previewDims.width,
      y: 0
    }
  }, otherProps)), /*#__PURE__*/React.createElement(CropPoint, _extends({
    pointArea: "right-bottom",
    defaultPosition: {
      x: 0,
      y: previewDims.height
    }
  }, otherProps)), /*#__PURE__*/React.createElement(CropPoint, _extends({
    pointArea: "left-bottom",
    defaultPosition: {
      x: previewDims.width,
      y: previewDims.height
    }
  }, otherProps)));
};
CropPoints.propTypes = {
  previewDims: T.shape({
    ratio: T.number,
    width: T.number,
    height: T.number
  })
};

var transform = function transform(cv, docCanvas, cropPoints, imageResizeRatio, setPreviewPaneDimensions) {
  var _ref, _ref2;

  var dst = cv.imread(docCanvas);
  var bR = cropPoints['right-bottom'];
  var bL = cropPoints['left-bottom'];
  var tR = cropPoints['right-top'];
  var tL = cropPoints['left-top'];
  var sourceCoordinates = [tL, tR, bR, bL].map(function (point) {
    return [point.x / imageResizeRatio, point.y / imageResizeRatio];
  });
  var maxWidth = Math.max(bR.x - bL.x, tR.x - tL.x) / imageResizeRatio;
  var maxHeight = Math.max(bL.y - tL.y, bR.y - tR.y) / imageResizeRatio;
  var destCoordinates = [[0, 0], [maxWidth - 1, 0], [maxWidth - 1, maxHeight - 1], [0, maxHeight - 1]];
  var Ms = cv.matFromArray(4, 1, cv.CV_32FC2, (_ref = []).concat.apply(_ref, sourceCoordinates));
  var Md = cv.matFromArray(4, 1, cv.CV_32FC2, (_ref2 = []).concat.apply(_ref2, destCoordinates));
  var transformMatrix = cv.getPerspectiveTransform(Ms, Md);
  var dsize = new cv.Size(maxWidth, maxHeight);
  cv.warpPerspective(dst, dst, transformMatrix, dsize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar());
  cv.imshow(docCanvas, dst);
  dst["delete"]();
  Ms["delete"]();
  Md["delete"]();
  transformMatrix["delete"]();
  setPreviewPaneDimensions();
};
var applyFilter = function applyFilter(cv, docCanvas, filterCvParams) {
  try {
    var options = _extends({
      blur: false,
      th: true,
      thMode: cv.ADAPTIVE_THRESH_MEAN_C,
      thMeanCorrection: 15,
      thBlockSize: 25,
      thMax: 255,
      grayScale: true
    }, filterCvParams);

    var dst = cv.imread(docCanvas);

    if (options.grayScale) {
      cv.cvtColor(dst, dst, cv.COLOR_RGBA2GRAY, 0);
    }

    if (options.blur) {
      var ksize = new cv.Size(5, 5);
      cv.GaussianBlur(dst, dst, ksize, 0, 0, cv.BORDER_DEFAULT);
    }

    if (options.th) {
      if (options.grayScale) {
        cv.adaptiveThreshold(dst, dst, options.thMax, options.thMode, cv.THRESH_BINARY, options.thBlockSize, options.thMeanCorrection);
      } else {
        dst.convertTo(dst, -1, 1, 60);
        cv.threshold(dst, dst, 170, 255, cv.THRESH_BINARY);
      }
    }

    cv.imshow(docCanvas, dst);
    return Promise.resolve();
  } catch (e) {
    return Promise.reject(e);
  }
};

var CropPointsDelimiters = function CropPointsDelimiters(_ref) {
  var cropPoints = _ref.cropPoints,
      previewDims = _ref.previewDims,
      _ref$lineWidth = _ref.lineWidth,
      lineWidth = _ref$lineWidth === void 0 ? 3 : _ref$lineWidth,
      _ref$lineColor = _ref.lineColor,
      lineColor = _ref$lineColor === void 0 ? '#3cabe2' : _ref$lineColor,
      pointSize = _ref.pointSize;
  var canvas = useRef();
  var clearCanvas = useCallback(function () {
    var ctx = canvas.current.getContext('2d');
    ctx.clearRect(0, 0, previewDims.width, previewDims.height);
  }, [canvas.current, previewDims]);
  var sortPoints = useCallback(function () {
    var sortOrder = ['left-top', 'right-top', 'right-bottom', 'left-bottom'];
    return sortOrder.reduce(function (acc, pointPos) {
      return [].concat(acc, [cropPoints[pointPos]]);
    }, []);
  }, [cropPoints]);
  var drawShape = useCallback(function (_ref2) {
    var point1 = _ref2[0],
        point2 = _ref2[1],
        point3 = _ref2[2],
        point4 = _ref2[3];
    var ctx = canvas.current.getContext('2d');
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = lineColor;
    ctx.beginPath();
    ctx.moveTo(point1.x + pointSize / 2, point1.y);
    ctx.lineTo(point2.x - pointSize / 2, point2.y);
    ctx.moveTo(point2.x, point2.y + pointSize / 2);
    ctx.lineTo(point3.x, point3.y - pointSize / 2);
    ctx.moveTo(point3.x - pointSize / 2, point3.y);
    ctx.lineTo(point4.x + pointSize / 2, point4.y);
    ctx.moveTo(point4.x, point4.y - pointSize / 2);
    ctx.lineTo(point1.x, point1.y + pointSize / 2);
    ctx.closePath();
    ctx.stroke();
  }, [canvas.current]);
  useEffect(function () {
    if (cropPoints && canvas.current) {
      clearCanvas();
      var sortedPoints = sortPoints();
      drawShape(sortedPoints);
    }
  }, [cropPoints, canvas.current]);
  return /*#__PURE__*/React.createElement("canvas", {
    ref: canvas,
    style: {
      position: 'absolute',
      zIndex: 5
    },
    width: previewDims.width,
    height: previewDims.height
  });
};
CropPointsDelimiters.propTypes = {
  previewDims: T.shape({
    ratio: T.number,
    width: T.number,
    height: T.number
  }),
  cropPoints: T.shape({
    'left-top': T.shape({
      x: T.number,
      y: T.number
    }).isRequired,
    'right-top': T.shape({
      x: T.number,
      y: T.number
    }).isRequired,
    'right-bottom': T.shape({
      x: T.number,
      y: T.number
    }).isRequired,
    'left-bottom': T.shape({
      x: T.number,
      y: T.number
    }).isRequired
  }),
  lineColor: T.string,
  lineWidth: T.number,
  pointSize: T.number
};

var buildImgContainerStyle = function buildImgContainerStyle(previewDims) {
  return {
    width: previewDims.width,
    height: previewDims.height
  };
};

var imageDimensions = {
  width: 0,
  height: 0
};
var imageResizeRatio;

var Canvas = function Canvas(_ref) {
  var _previewCanvasRef$cur, _previewCanvasRef$cur2, _previewCanvasRef$cur3, _previewCanvasRef$cur4, _previewCanvasRef$cur5, _previewCanvasRef$cur6;

  var image = _ref.image,
      onDragStop = _ref.onDragStop,
      onChange = _ref.onChange,
      cropperRef = _ref.cropperRef,
      _ref$pointSize = _ref.pointSize,
      pointSize = _ref$pointSize === void 0 ? 30 : _ref$pointSize,
      lineWidth = _ref.lineWidth,
      pointBgColor = _ref.pointBgColor,
      pointBorder = _ref.pointBorder,
      lineColor = _ref.lineColor,
      maxWidth = _ref.maxWidth,
      maxHeight = _ref.maxHeight;

  var _useOpenCv = useOpenCv(),
      cvLoaded = _useOpenCv.loaded,
      cv = _useOpenCv.cv;

  var canvasRef = useRef();
  var previewCanvasRef = useRef();
  var magnifierCanvasRef = useRef();

  var _useState = useState(),
      previewDims = _useState[0],
      setPreviewDims = _useState[1];

  var _useState2 = useState(),
      cropPoints = _useState2[0],
      setCropPoints = _useState2[1];

  var _useState3 = useState(false),
      loading = _useState3[0],
      setLoading = _useState3[1];

  var _useState4 = useState('crop'),
      mode = _useState4[0],
      setMode = _useState4[1];

  useImperativeHandle(cropperRef, function () {
    return {
      backToCrop: function backToCrop() {
        setMode('crop');
      },
      done: function (opts) {
        if (opts === void 0) {
          opts = {};
        }

        try {
          return Promise.resolve(new Promise(function (resolve) {
            setLoading(true);
            transform(cv, canvasRef.current, cropPoints, imageResizeRatio, setPreviewPaneDimensions);
            applyFilter(cv, canvasRef.current, opts.filterCvParams);

            if (opts.preview) {
              setMode('preview');
            }

            canvasRef.current.toBlob(function (blob) {
              blob.name = image.name;
              resolve(blob);
              setLoading(false);
            }, image.type);
          }));
        } catch (e) {
          return Promise.reject(e);
        }
      }
    };
  });
  useEffect(function () {
    if (mode === 'preview') {
      showPreview();
    }
  }, [mode]);

  var setPreviewPaneDimensions = function setPreviewPaneDimensions() {
    var newPreviewDims = calcDims(canvasRef.current.width, canvasRef.current.height, maxWidth, maxHeight);
    setPreviewDims(newPreviewDims);
    previewCanvasRef.current.width = newPreviewDims.width;
    previewCanvasRef.current.height = newPreviewDims.height;
    imageResizeRatio = newPreviewDims.width / canvasRef.current.width;
  };

  var createCanvas = function createCanvas(src) {
    return new Promise(function (resolve, reject) {
      var img = document.createElement('img');

      img.onload = function () {
        try {
          canvasRef.current = document.createElement('canvas');
          canvasRef.current.width = img.width;
          canvasRef.current.height = img.height;
          var ctx = canvasRef.current.getContext('2d');
          ctx.drawImage(img, 0, 0);
          imageDimensions.width = canvasRef.current.width;
          imageDimensions.height = canvasRef.current.height;
          setPreviewPaneDimensions();
          resolve();
          return Promise.resolve();
        } catch (e) {
          return Promise.reject(e);
        }
      };

      if (isCrossOriginURL(src)) img.crossOrigin = "anonymous";
      img.src = src;
    });
  };

  var showPreview = function showPreview(image) {
    var src = image || cv.imread(canvasRef.current);
    var dst = new cv.Mat();
    var dsize = new cv.Size(0, 0);
    cv.resize(src, dst, dsize, imageResizeRatio, imageResizeRatio, cv.INTER_AREA);
    cv.imshow(previewCanvasRef.current, dst);
    src["delete"]();
    dst["delete"]();
  };

  var detectContours = function detectContours() {
    var dst = cv.imread(canvasRef.current);
    var ksize = new cv.Size(5, 5);
    cv.cvtColor(dst, dst, cv.COLOR_RGBA2GRAY, 0);
    cv.GaussianBlur(dst, dst, ksize, 0, 0, cv.BORDER_DEFAULT);
    cv.Canny(dst, dst, 75, 200);
    cv.threshold(dst, dst, 120, 200, cv.THRESH_BINARY);
    var contours = new cv.MatVector();
    var hierarchy = new cv.Mat();
    cv.findContours(dst, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);
    var rect = cv.boundingRect(dst);
    dst["delete"]();
    hierarchy["delete"]();
    contours["delete"]();
    Object.keys(rect).forEach(function (key) {
      rect[key] = rect[key] * imageResizeRatio;
    });
    var contourCoordinates = {
      'left-top': {
        x: rect.x,
        y: rect.y
      },
      'right-top': {
        x: rect.x + rect.width,
        y: rect.y
      },
      'right-bottom': {
        x: rect.x + rect.width,
        y: rect.y + rect.height
      },
      'left-bottom': {
        x: rect.x,
        y: rect.y + rect.height
      }
    };
    setCropPoints(contourCoordinates);
  };

  var clearMagnifier = function clearMagnifier() {
    var magnCtx = magnifierCanvasRef.current.getContext('2d');
    magnCtx.clearRect(0, 0, magnifierCanvasRef.current.width, magnifierCanvasRef.current.height);
  };

  useEffect(function () {
    if (onChange) {
      onChange(_extends({}, cropPoints, {
        loading: loading
      }));
    }
  }, [cropPoints, loading]);
  useEffect(function () {
    var bootstrap = function bootstrap() {
      try {
        return Promise.resolve(readFile(image)).then(function (src) {
          return Promise.resolve(createCanvas(src)).then(function () {
            showPreview();
            detectContours();
            setLoading(false);
          });
        });
      } catch (e) {
        return Promise.reject(e);
      }
    };

    if (image && previewCanvasRef.current && cvLoaded && mode === 'crop') {
      bootstrap();
    } else {
      setLoading(true);
    }
  }, [image, previewCanvasRef.current, cvLoaded, mode]);
  var onDrag = useCallback(function (position, area) {
    var x = position.x,
        y = position.y;
    var magnCtx = magnifierCanvasRef.current.getContext('2d');
    clearMagnifier();
    magnCtx.drawImage(previewCanvasRef.current, x - (pointSize - 10), y - (pointSize - 10), pointSize + 5, pointSize + 5, x + 10, y - 90, pointSize + 20, pointSize + 20);
    setCropPoints(function (cPs) {
      var _extends2;

      return _extends({}, cPs, (_extends2 = {}, _extends2[area] = {
        x: x,
        y: y
      }, _extends2));
    });
  }, []);
  var onStop = useCallback(function (position, area, cropPoints) {
    var x = position.x,
        y = position.y;
    clearMagnifier();
    setCropPoints(function (cPs) {
      var _extends3;

      return _extends({}, cPs, (_extends3 = {}, _extends3[area] = {
        x: x,
        y: y
      }, _extends3));
    });

    if (onDragStop) {
      var _extends4;

      onDragStop(_extends({}, cropPoints, (_extends4 = {}, _extends4[area] = {
        x: x,
        y: y
      }, _extends4)));
    }
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    style: _extends({
      position: 'relative'
    }, previewDims && buildImgContainerStyle(previewDims))
  }, previewDims && mode === 'crop' && cropPoints && /*#__PURE__*/React.createElement(Fragment, null, /*#__PURE__*/React.createElement(CropPoints, {
    pointSize: pointSize,
    pointBgColor: pointBgColor,
    pointBorder: pointBorder,
    cropPoints: cropPoints,
    previewDims: previewDims,
    onDrag: onDrag,
    onStop: onStop,
    bounds: {
      left: (previewCanvasRef === null || previewCanvasRef === void 0 ? void 0 : (_previewCanvasRef$cur = previewCanvasRef.current) === null || _previewCanvasRef$cur === void 0 ? void 0 : _previewCanvasRef$cur.offsetLeft) - pointSize / 2,
      top: (previewCanvasRef === null || previewCanvasRef === void 0 ? void 0 : (_previewCanvasRef$cur2 = previewCanvasRef.current) === null || _previewCanvasRef$cur2 === void 0 ? void 0 : _previewCanvasRef$cur2.offsetTop) - pointSize / 2,
      right: (previewCanvasRef === null || previewCanvasRef === void 0 ? void 0 : (_previewCanvasRef$cur3 = previewCanvasRef.current) === null || _previewCanvasRef$cur3 === void 0 ? void 0 : _previewCanvasRef$cur3.offsetLeft) - pointSize / 2 + (previewCanvasRef === null || previewCanvasRef === void 0 ? void 0 : (_previewCanvasRef$cur4 = previewCanvasRef.current) === null || _previewCanvasRef$cur4 === void 0 ? void 0 : _previewCanvasRef$cur4.offsetWidth),
      bottom: (previewCanvasRef === null || previewCanvasRef === void 0 ? void 0 : (_previewCanvasRef$cur5 = previewCanvasRef.current) === null || _previewCanvasRef$cur5 === void 0 ? void 0 : _previewCanvasRef$cur5.offsetTop) - pointSize / 2 + (previewCanvasRef === null || previewCanvasRef === void 0 ? void 0 : (_previewCanvasRef$cur6 = previewCanvasRef.current) === null || _previewCanvasRef$cur6 === void 0 ? void 0 : _previewCanvasRef$cur6.offsetHeight)
    }
  }), /*#__PURE__*/React.createElement(CropPointsDelimiters, {
    previewDims: previewDims,
    cropPoints: cropPoints,
    lineWidth: lineWidth,
    lineColor: lineColor,
    pointSize: pointSize
  }), /*#__PURE__*/React.createElement("canvas", {
    style: {
      position: 'absolute',
      zIndex: 5,
      pointerEvents: 'none'
    },
    width: previewDims.width,
    height: previewDims.height,
    ref: magnifierCanvasRef
  })), /*#__PURE__*/React.createElement("canvas", {
    style: {
      zIndex: 5,
      pointerEvents: 'none'
    },
    ref: previewCanvasRef
  }));
};
Canvas.propTypes = {
  image: T.object.isRequired,
  onDragStop: T.func,
  onChange: T.func,
  cropperRef: T.shape({
    current: T.shape({
      done: T.func.isRequired,
      backToCrop: T.func.isRequired
    })
  }),
  pointSize: T.number,
  lineWidth: T.number,
  pointBgColor: T.string,
  pointBorder: T.string,
  lineColor: T.string
};

var Cropper = React.forwardRef(function (props, ref) {
  if (!props.image) {
    return null;
  }

  return /*#__PURE__*/React.createElement(OpenCvProvider, {
    openCvPath: props.openCvPath
  }, /*#__PURE__*/React.createElement(Canvas, _extends({}, props, {
    cropperRef: ref
  })));
});
Cropper.propTypes = {
  openCvPath: T.string
};

export default Cropper;
//# sourceMappingURL=index.modern.js.map
