const { AwesomeQR } = require('awesome-qr')
import {
  Encoder,
  Decoder,
  QRByte,
  QRKanji,
  ErrorCorrectionLevel
} from '@nuintun/qrcode'

const qrcodeDecoder = new Decoder()

export const generateQrCodeBase64 = async (text: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    // const meta = text.startsWith('http') ? text : EXTENSION_LINK + text;
    const meta = text
    const url = 'https://s3.bmp.ovh/imgs/2022/02/f88fe67806036f90.png'
    fetch(url)
      .then((res) => res.blob())
      .then((blob) => {
        const reader = new FileReader()
        reader.onload = function () {
          new AwesomeQR({
            text: meta,
            size: 200,
            margin: 20,
            // backgroundImage: this.result,
            logoImage: this.result,
            logoScale: 0.2
            // dotScale: 0.5,
            // scale: 0.5,
          })
            .draw()
            .then((dataURL) => resolve(dataURL))
        }
        reader.readAsDataURL(blob)
      })
  })
}

export const decodeQrcodeFromImgSrc = async (
  imgSrc: string
): Promise<string> => {
  // try scan twice
  try {
    const _result = await qrcodeDecoder.scan(imgSrc)
    if (_result) {
      return _result.data
    }
  } catch (error) {
    // qrcode error
    // console.error(error)
  }
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')

  return new Promise((resolve, reject) => {
    const image = new Image()
    image.crossOrigin = 'anonymous'
    image.src = imgSrc

    image.onload = function () {
      try {
        const width = image.width
        const height = image.height
        const qrCodeX = width / 2 - 50 // qrcode is 100 x100
        const qrCodeY = height / 2 - 50
        context?.drawImage(image, qrCodeX, qrCodeY, 100, 100, 0, 0, 100, 100)
        const imageData = context?.getImageData(0, 0, 100, 100)
        const result = qrcodeDecoder
          .setOptions({ canOverwriteImage: false })
          .decode(imageData!.data, imageData!.width, imageData!.height)
        resolve(result?.data)
      } catch (err) {
        // second try with canvas
        // console.error(err)
        reject(err)
      }
    }
  })
}
