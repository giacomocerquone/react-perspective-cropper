import React, { useCallback, useRef, useState } from 'react'

import { DocumentScanner, cropAndFilterImg } from 'react-doc-scan'

const App = () => {
  const res = useRef()
  const [cropState, setCropState] = useState()
  const [img, setImg] = useState()

  const onCropComplete = useCallback((s) => setCropState(s), [])

  const doSomething = () => {
    const filterOpts = {
      format: 'blob', // or base64
      brightness: 0.3,
      saturation: 1,
      contrast: 1.1
    }
    const editedImg = cropAndFilterImg(img, cropState, filterOpts)
    res.current = editedImg
    // in res.current you have the cropped and filtered image
  }

  const onImgSelection = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      // it can also be a http or base64 string for example
      setImg(e.target.files[0])
    }
  }

  return (
    <div
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}
    >
      <DocumentScanner image={img} onComplete={onCropComplete} />
      <input type='file' onChange={onImgSelection} accept='image/*' />
      <button onClick={doSomething}>Ho finito</button>
    </div>
  )
}

export default App
