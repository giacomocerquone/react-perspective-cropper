import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from 'react'
import { useOpenCv } from 'opencv-react'
import T from 'prop-types'

import { calcDims, readFile } from '../lib/utils'
import useRefCallback from '../hooks/useRefCallback'
import CropPoints from '../lib/CropPoints'
import { applyFilter, transform } from '../lib/imgManipulation'
import CropPointsDelimiters from './CropPointsDelimiters'

const buildImgContainerStyle = (previewDims) => ({
  width: previewDims.width,
  height: previewDims.height
})

const imageDimensions = { width: 0, height: 0 }
let imageResizeRatio

const Canvas = ({ image, onDragStop, onChange, cropperRef, pointSize }) => {
  const { loaded: cvLoaded, cv } = useOpenCv()
  const canvasRef = useRef()
  const [previewCanvas, setPreviewCanvasRef] = useRefCallback()
  const [previewDims, setPreviewDims] = useState()
  const [cropPoints, setCropPoints] = useState()
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState('crop')

  useImperativeHandle(cropperRef, () => ({
    backToCrop: () => {
      setMode('crop')
    },
    done: async (opts = {}) => {
      return new Promise((resolve) => {
        setLoading(true)
        transform(
          cv,
          canvasRef.current,
          cropPoints,
          imageResizeRatio,
          setPreviewPaneDimensions
        )
        applyFilter(cv, canvasRef.current)
        if (opts.preview) {
          setMode('preview')
        }
        canvasRef.current.toBlob((blob) => {
          resolve(blob)
          setLoading(false)
        }, image.type)
      })
    }
  }))

  useEffect(() => {
    if (mode === 'preview') {
      showPreview()
    }
  }, [mode])

  const setPreviewPaneDimensions = () => {
    // set preview pane dimensions
    const newPreviewDims = calcDims(
      canvasRef.current.width,
      canvasRef.current.height
    )
    setPreviewDims(newPreviewDims)

    previewCanvas.width = newPreviewDims.width
    previewCanvas.height = newPreviewDims.height

    imageResizeRatio = newPreviewDims.width / canvasRef.current.width
  }

  const createCanvas = (src) => {
    return new Promise((resolve, reject) => {
      const img = document.createElement('img')
      img.onload = async () => {
        // set edited image canvas and dimensions
        canvasRef.current = document.createElement('canvas')
        canvasRef.current.width = img.width
        canvasRef.current.height = img.height
        const ctx = canvasRef.current.getContext('2d')
        ctx.drawImage(img, 0, 0)
        imageDimensions.width = canvasRef.current.width
        imageDimensions.height = canvasRef.current.height
        setPreviewPaneDimensions()
        resolve()
      }
      img.src = src
    })
  }

  const showPreview = (image) => {
    const src = image || cv.imread(canvasRef.current)
    const dst = new cv.Mat()
    const dsize = new cv.Size(0, 0)
    cv.resize(
      src,
      dst,
      dsize,
      imageResizeRatio,
      imageResizeRatio,
      cv.INTER_AREA
    )
    cv.imshow(previewCanvas, dst)
    src.delete()
    dst.delete()
  }

  const detectContours = () => {
    const dst = cv.imread(canvasRef.current)
    const ksize = new cv.Size(5, 5)
    // convert the image to grayscale, blur it, and find edges in the image
    cv.cvtColor(dst, dst, cv.COLOR_RGBA2GRAY, 0)
    cv.GaussianBlur(dst, dst, ksize, 0, 0, cv.BORDER_DEFAULT)
    cv.Canny(dst, dst, 75, 200)
    // find contours
    cv.threshold(dst, dst, 120, 200, cv.THRESH_BINARY)
    const contours = new cv.MatVector()
    const hierarchy = new cv.Mat()
    cv.findContours(
      dst,
      contours,
      hierarchy,
      cv.RETR_CCOMP,
      cv.CHAIN_APPROX_SIMPLE
    )
    const rect = cv.boundingRect(dst)
    dst.delete()
    hierarchy.delete()
    contours.delete()
    // transform the rectangle into a set of points
    Object.keys(rect).forEach((key) => {
      rect[key] = rect[key] * imageResizeRatio
    })

    const contourCoordinates = {
      'left-top': { x: rect.x, y: rect.y },
      'right-top': { x: rect.x + rect.width, y: rect.y },
      'right-bottom': {
        x: rect.x + rect.width,
        y: rect.y + rect.height
      },
      'left-bottom': { x: rect.x, y: rect.y + rect.height }
    }

    setCropPoints(contourCoordinates)
  }

  useEffect(() => {
    if (onChange) {
      onChange(cropPoints)
    }
  }, [cropPoints])

  useEffect(() => {
    const bootstrap = async () => {
      const src = await readFile(image)
      await createCanvas(src)
      showPreview()
      detectContours()
    }

    if (image && previewCanvas && cvLoaded && mode === 'crop') {
      bootstrap()
    }
  }, [image, previewCanvas, cvLoaded, mode])

  const onDrag = useCallback((position, area) => {
    const { x, y } = position
    setCropPoints((cPs) => ({ ...cPs, [area]: { x, y } }))
  }, [])

  const onStop = useCallback((position, area, cropPoints) => {
    const { x, y } = position
    setCropPoints((cPs) => ({ ...cPs, [area]: { x, y } }))
    if (onDragStop) {
      onDragStop({ ...cropPoints, [area]: { x, y } })
    }
  }, [])

  return (
    <div
      style={{
        position: 'relative',
        ...(previewDims && buildImgContainerStyle(previewDims))
      }}
    >
      {previewDims && mode === 'crop' && cropPoints && (
        <CropPoints
          pointSize={pointSize}
          cropPoints={cropPoints}
          previewDims={previewDims}
          onDrag={onDrag}
          onStop={onStop}
        />
      )}
      {previewDims && mode === 'crop' && cropPoints && (
        <CropPointsDelimiters
          previewDims={previewDims}
          cropPoints={cropPoints}
        />
      )}
      <canvas
        style={{ zIndex: 5, pointerEvents: 'none' }}
        ref={setPreviewCanvasRef}
      />
    </div>
  )
}

export default Canvas

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
  pointSize: T.number
}
