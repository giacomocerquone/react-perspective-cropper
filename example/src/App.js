import React, { useCallback, useRef, useState } from 'react'

import { DocumentScanner, cropAndFilterImg } from 'react-doc-scan'

const App = () => {
  const res = useRef()
  const [cropState, setCropState] = useState()

  const onCropComplete = useCallback((s) => setCropState(s), [])

  const doSomething = () => {
    const filterOpts = {
      format: 'blob', // or base64
      brightness: 0.3,
      saturation: 1,
      contrast: 1.1
    }
    const editedImg = cropAndFilterImg(cropState, filterOpts)
    res.current = editedImg
    // In res.current you have the cropped and filtered image
  }

  return (
    <div>
      <DocumentScanner src='' onComplete={onCropComplete} />
      <button onClick={doSomething}>Ho finito</button>
    </div>
  )
}

export default App
