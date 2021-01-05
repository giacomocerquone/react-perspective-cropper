import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from 'react'
import { OpenCvProvider, useOpenCv } from 'opencv-react'

import { calcDims, readFile } from './lib/utils'
import useRefCallback from './hooks/useRefCallback'
import CropPoints from './lib/CropPoints'
import { applyFilter, transform } from './lib/imgManipulation'

const imageDimensions = { width: 0, height: 0 }
let imageResizeRatio

const buildImgContainerStyle = (previewDims) => ({
  width: previewDims.width,
  height: previewDims.height
})

// EDITEDIMAGE === docCanvas
// PREVIEWCANVAS === previewCanvas

export const DocumentScanner = React.forwardRef(
  ({ image, onDragStop }, ref) => {
    const docCanvasRef = useRef()
    const [previewCanvas, setPreviewCanvasRef] = useRefCallback()
    const [previewDims, setPreviewDims] = useState()
    const [cvLoaded, setCvLoaded] = useState(false)
    const [cropPoints, setCropPoints] = useState({})
    const cv = window.cv

    useImperativeHandle(ref, () => ({
      done: (opts) => {
        transform(
          cv,
          docCanvasRef.current,
          previewCanvas,
          cropPoints,
          imageResizeRatio
        )
        showPreview()
        applyFilter(cv, docCanvasRef.current)
        showPreview()
      }
    }))

    const setPreviewPaneDimensions = () => {
      // set preview pane dimensions
      const newPreviewDims = calcDims(
        docCanvasRef.current.width,
        docCanvasRef.current.height
      )
      setPreviewDims(newPreviewDims)

      previewCanvas.width = newPreviewDims.width
      previewCanvas.height = newPreviewDims.height

      imageResizeRatio = newPreviewDims.width / docCanvasRef.current.width
    }

    const createCanvas = (src) => {
      return new Promise((resolve, reject) => {
        const img = document.createElement('img')
        img.onload = async () => {
          // set edited image canvas and dimensions
          docCanvasRef.current = document.createElement('canvas')
          docCanvasRef.current.width = img.width
          docCanvasRef.current.height = img.height
          const ctx = docCanvasRef.current.getContext('2d')
          ctx.drawImage(img, 0, 0)
          imageDimensions.width = docCanvasRef.current.width
          imageDimensions.height = docCanvasRef.current.height
          setPreviewPaneDimensions()
          resolve()
        }
        img.src = src
      })
    }

    const showPreview = (image) => {
      const src = image || cv.imread(docCanvasRef.current)
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
      const dst = cv.imread(docCanvasRef.current)
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

      console.log('contours', contourCoordinates)

      setCropPoints(contourCoordinates)
    }

    const onOpenCvLoaded = useCallback(() => {
      setCvLoaded(true)
    }, [])

    useEffect(() => {
      const bootstrap = async () => {
        const src = await readFile(image)
        await createCanvas(src)
        showPreview()
        detectContours()
      }

      if (image && previewCanvas && cvLoaded) {
        bootstrap()
      }
    }, [image, previewCanvas, cvLoaded])

    const onDrag = useCallback((position, area) => {
      const { x, y } = position
      setCropPoints((cPs) => ({ ...cPs, [area]: { x, y } }))
    }, [])

    const onStop = useCallback(
      (position, area, cropPoints) => {
        const { x, y } = position
        setCropPoints((cPs) => ({ ...cPs, [area]: { x, y } }))
        onDragStop({ ...cropPoints, [area]: { x, y } })
      },
      [onDragStop]
    )

    if (!image) {
      return null
    }

    return (
      <OpenCvProvider openCvPath='/opencv/opencv.js' onLoad={onOpenCvLoaded}>
        <div
          style={{
            position: 'relative',
            ...(previewDims && buildImgContainerStyle(previewDims))
          }}
        >
          {previewDims && (
            <CropPoints
              cropPoints={cropPoints}
              previewDims={previewDims}
              onDrag={onDrag}
              onStop={onStop}
            />
          )}
          <canvas style={{ zIndex: 5 }} ref={setPreviewCanvasRef} />
        </div>
      </OpenCvProvider>
    )
  }
)
