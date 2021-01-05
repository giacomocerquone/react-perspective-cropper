import React, { useCallback } from 'react'
import Draggable from 'react-draggable'

const cropPointStyle = {
  width: 15,
  height: 15,
  backgroundColor: '#3cabe2',
  borderRadius: 0,
  position: 'absolute'
}

const CropPoint = ({
  cropPoints,
  pointArea,
  defaultPosition,
  onDrag: externalOnDrag
}) => {
  const onDrag = useCallback(
    (_, position) => {
      externalOnDrag(position, pointArea)
    },
    [externalOnDrag]
  )

  return (
    <Draggable
      bounds='parent'
      defaultPosition={defaultPosition}
      position={cropPoints[pointArea]}
      onDrag={onDrag}
    >
      <div style={cropPointStyle} />
    </Draggable>
  )
}

export default CropPoint
