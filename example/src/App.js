import React, { useCallback, useRef, useState } from 'react'
import { Button, Spin, Upload } from 'antd'
import { CheckOutlined, PlusOutlined } from '@ant-design/icons'
import Cropper from 'react-perspective-cropper'

import './App.css'
import Header from './components/Header'

const { Dragger } = Upload

const App = () => {
  const [cropState, setCropState] = useState()
  const [img, setImg] = useState()
  const cropperRef = useRef()

  const onDragStop = useCallback((s) => setCropState(s), [])
  const onChange = useCallback((s) => setCropState(s), [])

  const doSomething = async () => {
    console.log('CropState', cropState)
    try {
      const res = await cropperRef.current.done({
        preview: true,
        filterCvParams: {
          thMeanCorrection: 13,
          thMode: window.cv.ADAPTIVE_THRESH_GAUSSIAN_C
        }
      })
      console.log('Cropped and filtered image', res)
    } catch (e) {
      console.log('error', e)
    }
  }

  const onImgSelection = async (e) => {
    if (e.fileList && e.fileList.length > 0) {
      // it can also be a http or base64 string for example
      setImg(e.fileList[0].originFileObj)
    }
  }

  const draggerProps = {
    name: 'file',
    multiple: false,
    onChange: onImgSelection
  }

  return (
    <div className='root-container'>
      <Header />
      <div className='content-container'>
        {cropState && (
          <div className='buttons-container'>
            <Button onClick={doSomething} icon={<CheckOutlined />}>
              Done
            </Button>
            <Button
              onClick={() => {
                cropperRef.current.backToCrop()
              }}
            >
              Back
            </Button>
            <Button
              onClick={() => {
                setImg(undefined)
                setCropState()
              }}
            >
              Reset
            </Button>
          </div>
        )}
        <Cropper
          ref={cropperRef}
          image={img}
          onChange={onChange}
          onDragStop={onDragStop}
        />
        {cropState?.loading && <Spin />}
        {!img && (
          <Dragger {...draggerProps}>
            <p>
              <PlusOutlined />
            </p>
            <p>Upload</p>
          </Dragger>
        )}
      </div>
    </div>
  )
}

export default App
