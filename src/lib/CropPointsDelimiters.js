import React, { useCallback, useEffect } from 'react'
import useRefCallback from '../hooks/useRefCallback'

const CropPointsDelimiters = ({
  cropPoints,
  previewDims,
  imageResizeRatio
}) => {
  const [canvas, setCanvasRef] = useRefCallback()

  const clearCanvas = useCallback(() => {
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, previewDims.width, previewDims.height)
  }, [canvas, previewDims])

  const sortPoints = useCallback(() => {
    const sortOrder = ['left-top', 'right-top', 'right-bottom', 'left-bottom']
    return sortOrder.reduce(
      (acc, pointPos) => [...acc, cropPoints[pointPos]],
      []
    )
  }, [cropPoints])

  const drawShape = useCallback(
    (sortedPoints) => {
      const ctx = canvas.getContext('2d')
      ctx.lineWidth = 3
      ctx.strokeStyle = '#3cabe2'
      ctx.beginPath()
      sortedPoints.forEach((point, index) => {
        if (index === 0) {
          ctx.moveTo(point.x, point.y)
        }
        if (index !== sortedPoints.length - 1) {
          const nextPoint = sortedPoints[index + 1]
          ctx.lineTo(nextPoint.x, nextPoint.y)
        } else {
          ctx.closePath()
        }
      })
      ctx.stroke()
    },
    [canvas]
  )

  useEffect(() => {
    if (Object.keys(cropPoints).length && canvas) {
      clearCanvas()
      const sortedPoints = sortPoints()
      drawShape(sortedPoints)
    }
  }, [cropPoints, canvas])

  return (
    <canvas
      ref={setCanvasRef}
      style={{
        position: 'absolute',
        zIndex: 5,
        width: previewDims.width,
        height: previewDims.height
      }}
      width={previewDims.width}
      height={previewDims.height}
    />
  )
}

export default CropPointsDelimiters
