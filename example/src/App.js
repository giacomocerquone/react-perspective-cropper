import React, { useCallback, useRef, useState } from 'react'

import { Cropper } from 'react-perspective-cropper'

const App = () => {
  const [cropState, setCropState] = useState()
  const [img, setImg] = useState()
  const [inputKey, setInputKey] = useState(0)
  const cropperRef = useRef()

  const onDragStop = useCallback((s) => setCropState(s), [])
  const onChange = useCallback((s) => setCropState(s), [])

  const doSomething = async () => {
    console.log(cropState)
    try {
      const res = await cropperRef.current.done({ preview: true })
      console.log(res)
    } catch (e) {
      console.log('error', e)
    }
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
      <Cropper
        ref={cropperRef}
        image={img}
        onChange={onChange}
        onDragStop={onDragStop}
      />
      <input
        type='file'
        key={inputKey}
        onChange={onImgSelection}
        accept='image/*'
      />
      <button onClick={doSomething}>Ho finito</button>
      <button
        onClick={() => {
          cropperRef.current.backToCrop()
        }}
      >
        Back
      </button>
      <button
        onClick={() => {
          setImg(undefined)
          setInputKey((i) => i + 1)
        }}
      >
        Reset
      </button>
    </div>
  )
}

export default App
