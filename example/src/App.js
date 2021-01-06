import React, { useCallback, useRef, useState } from 'react'

import { Cropper } from 'react-perspective-cropper'

const App = () => {
  const [cropState, setCropState] = useState()
  const [img, setImg] = useState()
  const cropperRef = useRef()

  const onDragStop = useCallback((s) => setCropState(s), [])

  const doSomething = () => {
    const filterOpts = {
      format: 'blob' // or base64
    }
    console.log(cropState)
    cropperRef.current.done()
    // editedImg is your filtered, cropped and transformed image
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
      <Cropper ref={cropperRef} image={img} onDragStop={onDragStop} />
      <input type='file' onChange={onImgSelection} accept='image/*' />
      <button onClick={doSomething}>Ho finito</button>
      <button onClick={() => console.log('asd')}>asdasdasd</button>
    </div>
  )
}

export default App
