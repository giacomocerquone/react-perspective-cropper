import React, { Fragment } from 'react'
import CropPoint from './CropPoint'

const CropPoints = ({ previewDims, cropPoints, onDrag }) => {
  return (
    <>
      <CropPoint
        cropPoints={cropPoints}
        pointArea='left-top'
        defaultPosition={{ x: 0, y: 0 }}
        onDrag={onDrag}
      />
      <CropPoint
        cropPoints={cropPoints}
        pointArea='right-top'
        defaultPosition={{ x: previewDims.width, y: 0 }}
        onDrag={onDrag}
      />
      <CropPoint
        cropPoints={cropPoints}
        pointArea='right-bottom'
        defaultPosition={{ x: 0, y: previewDims.height }}
        onDrag={onDrag}
      />
      <CropPoint
        cropPoints={cropPoints}
        pointArea='left-bottom'
        defaultPosition={{
          x: previewDims.width,
          y: previewDims.height
        }}
        onDrag={onDrag}
      />
    </>
  )
}

export default CropPoints
