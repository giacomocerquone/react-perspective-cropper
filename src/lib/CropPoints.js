import React, { Fragment } from 'react'
import CropPoint from './CropPoint'

const CropPoints = (props) => {
  const { previewDims, ...otherProps } = props
  return (
    <>
      <CropPoint
        pointArea='left-top'
        defaultPosition={{ x: 0, y: 0 }}
        {...otherProps}
      />
      <CropPoint
        pointArea='right-top'
        defaultPosition={{ x: previewDims.width, y: 0 }}
        {...otherProps}
      />
      <CropPoint
        pointArea='right-bottom'
        defaultPosition={{ x: 0, y: previewDims.height }}
        {...otherProps}
      />
      <CropPoint
        pointArea='left-bottom'
        defaultPosition={{
          x: previewDims.width,
          y: previewDims.height
        }}
        {...otherProps}
      />
    </>
  )
}

export default CropPoints
