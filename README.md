# react-perspective-cropper

> React component performing border detection, perspective correction and simple image filters over a provided image 📲 📸

[![NPM](https://img.shields.io/npm/v/react-perspective-cropper.svg)](https://www.npmjs.com/package/react-perspective-cropper) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Intro

react-perspective-cropper doesn't, yet, do live borders recognition like some famous mobile apps.<br />
Though it exports a main `<Cropper />` component which given an image it renders a cropper component with an already applied but editable crop area.<br />
You **must** pass an img through the `src` prop otherwise the component won't be rendered. Using its ref you have a `done` async method that you can call and it will return the cropped and filtered image (you can choose the result format between base64 and blob).<br /><br />

If you have special needs, please open a issue and we'll discuss it there!

## Install

```bash
npm i react-perspective-cropper
```

or

```bash
yarn add react-perspective-cropper
```

## Usage

```jsx
import React, { Component } from 'react'

import MyComponent from 'react-perspective-cropper'
import 'react-perspective-cropper/dist/index.css'

class Example extends Component {
  render() {
    return <MyComponent />
  }
}
```

## Usage

## OpenCV

This cropper uses OpenCV for border recognition, perspective transformation and b&w thresholding. In order to use it, I've created this other handy wrapper around it: [opencv-react](https://github.com/giacomocerquone/opencv-react)<br/>
If you're already using it or if you're importing OpenCV manually in a different way, **this lib got you covered as long as you provide the OpenCV instance in `window.cv` and the component isn't rendered before OpenCV finished loading**. <br/>
So, be careful.

## Nice to have

It would be nice to have a react-doc-scan component which uses a webcam featuring live borders recognition.

## Inspiration and help

Huge thanks to [ngx-document-scanner](https://github.com/roiperlman/ngx-document-scanner) which served me quite a lot of openCV code to use.

## License

MIT © [giacomocerquone](https://github.com/giacomocerquone)
