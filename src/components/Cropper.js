import React from 'react'
import { OpenCvProvider } from 'opencv-react'
import Canvas from '../lib/Canvas'

export const Cropper = React.forwardRef((props, ref) => {
  if (!props.image) {
    return null
  }

  return (
    <OpenCvProvider openCvPath='/opencv/opencv.js'>
      <Canvas {...props} cropperRef={ref} />
    </OpenCvProvider>
  )
})
