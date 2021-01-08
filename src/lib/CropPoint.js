import React, { useCallback } from 'react'
import Draggable from 'react-draggable'

const cropPointStyle = {
  width: 15,
  height: 15,
  backgroundColor: '#3cabe2',
  borderRadius: '100%',
  position: 'absolute',
  zIndex: 1001
}

const CropPoint = ({
  cropPoints,
  pointArea,
  defaultPosition,
  onStop: externalOnStop,
  onDrag: externalOnDrag
}) => {
  const onDrag = useCallback(
    (_, position) => {
      externalOnDrag(position, pointArea)
    },
    [externalOnDrag]
  )

  const onStop = useCallback(
    (_, position) => {
      externalOnStop(position, pointArea, cropPoints)
    },
    [externalOnDrag, cropPoints]
  )

  return (
    <Draggable
      bounds='parent'
      defaultPosition={defaultPosition}
      position={cropPoints[pointArea]}
      onDrag={onDrag}
      onStop={onStop}
    >
      <div style={cropPointStyle} />
    </Draggable>
  )
}

export default CropPoint
