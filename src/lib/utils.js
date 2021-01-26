export const readFile = (file) => {
  if (file instanceof File) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        resolve(reader.result)
      }
      reader.onerror = (err) => {
        reject(err)
      }
      reader.readAsDataURL(file)
    })
  }
  if (typeof file === 'string') {
    return Promise.resolve(file)
  }
}

export const calcDims = (
  width,
  height,
  externalMaxWidth,
  externalMaxHeight
) => {
  const ratio = width / height

  const maxWidth = externalMaxWidth || window.innerWidth
  const maxHeight = externalMaxHeight || window.innerHeight
  const calculated = {
    width: maxWidth,
    height: Math.round(maxWidth / ratio),
    ratio: ratio
  }

  if (calculated.height > maxHeight) {
    calculated.height = maxHeight
    calculated.width = Math.round(maxHeight * ratio)
  }
  return calculated
}
