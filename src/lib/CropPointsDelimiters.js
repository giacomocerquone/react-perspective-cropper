import React, { useCallback, useEffect, useRef } from 'react'
import T from 'prop-types'

const CropPointsDelimiters = ({
  cropPoints,
  previewDims,
  lineWidth = 3,
  lineColor = '#3cabe2'
}) => {
  const canvas = useRef()

  const clearCanvas = useCallback(() => {
    const ctx = canvas.current.getContext('2d')
    ctx.clearRect(0, 0, previewDims.width, previewDims.height)
  }, [canvas.current, previewDims])

  const sortPoints = useCallback(() => {
    const sortOrder = ['left-top', 'right-top', 'right-bottom', 'left-bottom']
    return sortOrder.reduce(
      (acc, pointPos) => [...acc, cropPoints[pointPos]],
      []
    )
  }, [cropPoints])

  const drawShape = useCallback(
    (sortedPoints) => {
      const ctx = canvas.current.getContext('2d')
      ctx.lineWidth = lineWidth
      ctx.strokeStyle = lineColor
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
    [canvas.current]
  )

  useEffect(() => {
    if (cropPoints && canvas.current) {
      clearCanvas()
      const sortedPoints = sortPoints()
      drawShape(sortedPoints)
    }
  }, [cropPoints, canvas.current])

  return (
    <canvas
      ref={canvas}
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

CropPointsDelimiters.propTypes = {
  previewDims: T.shape({
    ratio: T.number,
    width: T.number,
    height: T.number
  }),
  cropPoints: T.shape({
    'left-top': T.shape({ x: T.number, y: T.number }).isRequired,
    'right-top': T.shape({ x: T.number, y: T.number }).isRequired,
    'right-bottom': T.shape({ x: T.number, y: T.number }).isRequired,
    'left-bottom': T.shape({ x: T.number, y: T.number }).isRequired
  }),
  lineColor: T.string,
  lineWidth: T.number
}
