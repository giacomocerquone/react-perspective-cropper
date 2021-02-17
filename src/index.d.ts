import * as React from 'react'

export interface CropperProps {
  image: string | File
  onDragStop: () => void
  onChange: () => void
  cropperRef: React.ElementRef
  pointSize: number
  lineWidth: number
  pointBgColor: string
  pointBorder: string
  lineColor: string
  maxWidth: number
  maxHeight: number
  openCvPath: string
}

const Cropper: React.FC<CropperProps>

export default Cropper
