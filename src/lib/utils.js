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

export const calcDims = (width, height) => {
  const ratio = width / height

  const maxWidth = window.innerWidth - 40
  const maxHeight = window.innerHeight - 240
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
