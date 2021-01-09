import React, { useCallback } from 'react'
import Draggable from 'react-draggable'
import T from 'prop-types'

const buildCropPointStyle = (size, color) => ({
  width: size,
  height: size,
  backgroundColor: color,
  borderRadius: '100%',
  position: 'absolute',
  zIndex: 1001
})

const CropPoint = ({
  cropPoints,
  pointArea,
  defaultPosition,
  pointSize = 20,
  pointColor = '#3cabe2',
  onStop: externalOnStop,
  onDrag: externalOnDrag
}) => {
  const onDrag = useCallback(
    (_, position) => {
      externalOnDrag(
        {
          ...position,
          x: position.x + pointSize / 2,
          y: position.y + pointSize / 2
        },
        pointArea
      )
    },
    [externalOnDrag]
  )

  const onStop = useCallback(
    (_, position) => {
      externalOnStop(
        {
          ...position,
          x: position.x + pointSize / 2,
          y: position.y + pointSize / 2
        },
        pointArea,
        cropPoints
      )
    },
    [externalOnDrag, cropPoints]
  )

  return (
    <Draggable
      bounds='parent'
      defaultPosition={defaultPosition}
      position={{
        x: cropPoints[pointArea].x - pointSize / 2,
        y: cropPoints[pointArea].y - pointSize / 2
      }}
      onDrag={onDrag}
      onStop={onStop}
    >
      <div style={buildCropPointStyle(pointSize, pointColor)} />
    </Draggable>
  )
}

export default CropPoint

CropPoint.propTypes = {
  cropPoints: T.shape({
    'left-top': T.shape({ x: T.number, y: T.number }).isRequired,
    'right-top': T.shape({ x: T.number, y: T.number }).isRequired,
    'right-bottom': T.shape({ x: T.number, y: T.number }).isRequired,
    'left-bottom': T.shape({ x: T.number, y: T.number }).isRequired
  }),
  pointArea: T.oneOf(['left-top', 'right-top', 'right-bottom', 'left-bottom']),
  defaultPosition: T.shape({
    x: T.number,
    y: T.number
  }),
  pointSize: T.number,
  pointColor: T.string,
  onStop: T.func,
  onDrag: T.func
}
