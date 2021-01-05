# react-perspective-cropper

> React component performing border detection, perspective correction and simple image filters over a provided image 📲 📸

[![NPM](https://img.shields.io/npm/v/react-perspective-cropper.svg)](https://www.npmjs.com/package/react-perspective-cropper) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Intro

react-perspective-cropper doesn't, yet, do live borders recognition like some famous mobile apps.<br />
Though it exports a main `<DocumentScanner />` component which given an image it renders a cropper component with an already applied but editable crop area.<br />
You **must** pass an img through the `src` prop otherwise the component won't be rendered. Then you get the "onComplete" callback that receives a cropState. Once you got that, whenever your user finished cropping, you can call a utility method exported by this lib which is `cropAndFilterImg()` which, guess what, crops and filter the image (you can choose the result format between base64 and blob).<br /><br />

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

## Inspiration and help

Huge thanks to [ngx-document-scanner](https://github.com/roiperlman/ngx-document-scanner) which served me quite a lot of openCV code to use.

## Nice to have

It would be nice to have a react-doc-scan component which uses a webcam featuring live borders recognition.

## License

MIT © [giacomocerquone](https://github.com/giacomocerquone)
