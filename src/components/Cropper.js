import React from 'react'
import { OpenCvProvider } from 'opencv-react'
import Canvas from '../lib/Canvas'

// EDITEDIMAGE === docCanvas
// PREVIEWCANVAS === previewCanvas

export const Cropper = React.forwardRef(({ image, onDragStop }, ref) => {
  if (!image) {
    return null
  }

  return (
    <OpenCvProvider openCvPath='/opencv/opencv.js'>
      <Canvas image={image} onDragStop={onDragStop} cropperRef={ref} />
    </OpenCvProvider>
  )
})
