export const transform = (
  cv,
  docCanvas,
  cropPoints,
  imageResizeRatio,
  setPreviewPaneDimensions
) => {
  const dst = cv.imread(docCanvas)

  const bR = cropPoints['right-bottom']
  const bL = cropPoints['left-bottom']
  const tR = cropPoints['right-top']
  const tL = cropPoints['left-top']

  // create source coordinates matrix
  const sourceCoordinates = [tL, tR, bR, bL].map((point) => [
    point.x / imageResizeRatio,
    point.y / imageResizeRatio
  ])

  // get max width
  const maxWidth = Math.max(bR.x - bL.x, tR.x - tL.x) / imageResizeRatio
  // get max height
  const maxHeight = Math.max(bL.y - tL.y, bR.y - tR.y) / imageResizeRatio

  // create dest coordinates matrix
  const destCoordinates = [
    [0, 0],
    [maxWidth - 1, 0],
    [maxWidth - 1, maxHeight - 1],
    [0, maxHeight - 1]
  ]

  // convert to open cv matrix objects
  const Ms = cv.matFromArray(4, 1, cv.CV_32FC2, [].concat(...sourceCoordinates))
  const Md = cv.matFromArray(4, 1, cv.CV_32FC2, [].concat(...destCoordinates))
  const transformMatrix = cv.getPerspectiveTransform(Ms, Md)
  // set new image size
  const dsize = new cv.Size(maxWidth, maxHeight)
  // perform warp
  cv.warpPerspective(
    dst,
    dst,
    transformMatrix,
    dsize,
    cv.INTER_LINEAR,
    cv.BORDER_CONSTANT,
    new cv.Scalar()
  )
  cv.imshow(docCanvas, dst)

  dst.delete()
  Ms.delete()
  Md.delete()
  transformMatrix.delete()

  setPreviewPaneDimensions()
}

export const applyFilter = async (cv, docCanvas, filterCvParams) => {
  // default options
  const options = {
    blur: false,
    th: true,
    thMode: cv.ADAPTIVE_THRESH_MEAN_C,
    thMeanCorrection: 15,
    thBlockSize: 25,
    thMax: 255,
    grayScale: true,
    ...filterCvParams
  }
  const dst = cv.imread(docCanvas)

  if (options.grayScale) {
    cv.cvtColor(dst, dst, cv.COLOR_RGBA2GRAY, 0)
  }
  if (options.blur) {
    const ksize = new cv.Size(5, 5)
    cv.GaussianBlur(dst, dst, ksize, 0, 0, cv.BORDER_DEFAULT)
  }
  if (options.th) {
    if (options.grayScale) {
      cv.adaptiveThreshold(
        dst,
        dst,
        options.thMax,
        options.thMode,
        cv.THRESH_BINARY,
        options.thBlockSize,
        options.thMeanCorrection
      )
    } else {
      dst.convertTo(dst, -1, 1, 60)
      cv.threshold(dst, dst, 170, 255, cv.THRESH_BINARY)
    }
  }
  cv.imshow(docCanvas, dst)
}
