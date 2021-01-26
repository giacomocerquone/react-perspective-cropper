# react-perspective-cropper

> React component performing border detection, perspective correction and simple image filters over a provided image 📲 📸

[![NPM](https://img.shields.io/npm/v/react-perspective-cropper.svg)](https://www.npmjs.com/package/react-perspective-cropper) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Intro

react-perspective-cropper doesn't, yet, do live borders recognition like some famous mobile apps.<br />
Though it exports a main `<Cropper />` component which given an image it renders a cropper component with an already applied but editable crop area.<br />
You **must** pass an img through the `src` prop otherwise the component won't be rendered. Using its ref you have:

- a `done` async method that you can call and it will return the cropped and filtered image and you have the option to also show a preview of the edited image!
- a `backToCrop` method to use **only** if you requested for a preview in the done.

<br />

If you have special needs, please open a issue and we'll discuss it there!

## Demo

![demo gif](https://github.com/giacomocerquone/react-perspective-cropper/blob/master/gifs/react-perspective-cropper.gif?raw=true)

Take a look at the hosted example [here](https://giacomocerquone.github.io/react-perspective-cropper/)

## Install

```bash
npm i react-perspective-cropper
```

or

```bash
yarn add react-perspective-cropper
```

## Props

```typescript
export interface CropperProps {
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
  openCvPath: string
}
```

## Usage

```jsx
import React from 'react'
import Cropper from 'react-perspective-cropper'

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
  )
}
```

## OpenCV

This cropper uses OpenCV for border recognition, perspective transformation and b&w thresholding. In order to use it, I've created this other handy wrapper around it: [opencv-react](https://github.com/giacomocerquone/opencv-react)<br/>
If you're already using it or if you're importing OpenCV manually in a different way, **this lib got you covered as long as you provide the OpenCV instance in `window.cv` and the component isn't rendered before OpenCV finished loading**. <br/>
So, be careful.

## Nice to have

It would be nice to have a react-doc-scan component which uses a webcam featuring live borders recognition.

## Inspiration and help

Huge thanks to [ngx-document-scanner](https://github.com/roiperlman/ngx-document-scanner) which served me quite some openCV and canvas code to use.

## License

MIT © [giacomocerquone](https://github.com/giacomocerquone)
