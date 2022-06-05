const drawImgInContext = async (
  canvas: any,
  img: any,
  x: number = 0,
  y: number = 0,
  w: number,
  h: number
) => {
  return new Promise((resolve, reject) => {
    img.onload = function () {
      if (this.width > this.height) {
        const cw = w
        const ch = (w * this.height) / this.width
        canvas.width = cw
        canvas.height = ch
        const context = canvas.getContext('2d')
        context.drawImage(img, x, y, cw, ch)
      } else {
        const ch = h
        const cw = (h * this.width) / this.height
        canvas.width = cw
        canvas.height = ch
        const context = canvas.getContext('2d')
        context.drawImage(img, x, y, cw, ch)
      }
      resolve(canvas)
    }
  })
}
const drawImgWithFixedSize = async (
  context: any,
  img: any,
  x: number = 0,
  y: number = 0,
  w: number,
  h: number
) => {
  return new Promise((resolve, reject) => {
    img.onload = function () {
      context.drawImage(img, x, y, w, h)
      resolve(context)
    }
  })
}

export const mixWatermarkImg = async (
  imgSrc: string | File,
  watermarkBase64: string,
  imgSrcW: number = 500,
  imgSrcH: number = 500,
  watermarkW: number = 100,
  watermarkH: number = 100
) => {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  // canvas.width = imgSrcH;
  // canvas.height = imgSrcW;
  const img = new Image()
  img.src = typeof imgSrc === 'string' ? imgSrc : URL.createObjectURL(imgSrc)
  img.setAttribute('crossOrigin', 'Anonymous')
  // img.onload = function () {
  //   context?.drawImage(img, 0, 0, imgSrcW, imgSrcH);
  // };
  await drawImgInContext(canvas, img, 0, 0, imgSrcW, imgSrcH)
  const watermarkImg = new Image()
  watermarkImg.src = watermarkBase64
  img.setAttribute('crossOrigin', 'Anonymous')
  await drawImgWithFixedSize(
    context,
    watermarkImg,
    (canvas.width - watermarkW) * 0.5,
    (canvas.height - watermarkH) * 0.5,
    watermarkW,
    watermarkH
  )
  const dataUrl = canvas.toDataURL('image/png')
  const dataBlob = await new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob)
    })
  })
  return [dataUrl, dataBlob as Blob]
}
