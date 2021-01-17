import * as React from 'react'

interface CropperProps {
  image: string | File
  onDragStop: () => void
  onChange: () => void
  cropperRef: React.ElementRef
  pointSize: number
  lineWidth: number
  pointColor: string
  lineColor: string
  maxWidth: number
  maxHeight: number
}

export function Cropper(): React.FC<CropperProps>
