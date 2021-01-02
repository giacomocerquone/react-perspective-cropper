import React from 'react'
import { OpenCvProvider, useOpenCv } from 'opencv-react'

function MyComp() {
  const data = useOpenCv()
  console.log(data)
  return <p>asdasd</p>
}

export const DocumentScanner = () => {
  return (
    <OpenCvProvider>
      <MyComp />
    </OpenCvProvider>
  )
}
