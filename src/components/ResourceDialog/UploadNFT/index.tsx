import React, { useState, useRef } from 'react'
import './index.less'
import { Upload, message } from 'antd'
import CommonButton from '../../Button'
import {
  getChainId,
  MessageTypes,
  sendMessage
} from '../../../utils/messageHandler'
import { ipfsAdd } from '../../../utils/ipfsHandler'
import { addToFav } from '../../../utils/apis'
import { mixWatermarkImg } from '../../../utils/imgHandler'
import * as QrCode from '../../../utils/qrcode'
import { generateMetaForQrcode, PlatwinContracts } from '@/utils/utils'
// import { pasteShareTextToEditor } from '../../../utils/utils';

interface IProps {
  account: string
  publishFunc?: () => void
}
export default (props: IProps) => {
  const { account, publishFunc } = props
  const [submitting, setSubmitting] = useState(false)
  const [localImg, setLocalImg] = useState<any>([])
  const ref = useRef<HTMLDivElement>(null)

  const beforeUpload = (file: any) => {
    setLocalImg([file])
    const preview = document.getElementById('preview') as HTMLImageElement
    preview.src = URL.createObjectURL(file)
    console.log('preview.src: ', preview.src)
    preview.onload = function () {
      URL.revokeObjectURL(preview.src) // free memory
    }
    // const reader = new FileReader()
    // reader.readAsDataURL(file)
    // reader.addEventListener('load', () => {
    //     console.log(reader.result)
    //     setPreviewLocalImg(reader.result as string)
    // })
    return false
  }

  const onRemove = () => {
    setLocalImg([])
  }

  const handleFinish = async () => {
    if (!account) {
      message.warning('Wallet not found. Please install metamask first.')
      return
    }
    // mint
    const clipboardData = []
    try {
      if (localImg && localImg[0]) {
        setSubmitting(true)
        // 1. upload to ipfs
        message.info('Uploading your resource to IPFS...', 5)
        const hash = await ipfsAdd(localImg[0])
        console.log('hash: ', hash)
        // 3. mint NFT
        const req = {
          type: MessageTypes.Mint_Token,
          request: {
            hash
          }
        }
        message.info('Minting your NFT...')
        const resp: any = await sendMessage(req)
        console.log('mint resp:', resp)
        const { tokenId } = resp.result
        if (!tokenId) {
          console.log(resp.result.error)
          setSubmitting(false)
          return
        }
        message.success(
          'Your NFT has successfully minted. Now add your thoughts and share with the world!',
          5
        )
        const chainId = await getChainId()
        const contract = PlatwinContracts.PlatwinMEME2WithoutRPC[chainId]
        //add to fav
        const params = {
          addr: account,
          contract,
          token_id: tokenId,
          fav: 1,
          uri: hash
        }
        await addToFav(params)
        // 2. create meta
        // t for twitter
        // const meta = `${hash}_${tokenId}`
        const meta = generateMetaForQrcode(chainId, contract, tokenId)
        console.log('meta: ', meta)
        // 4. create watermask
        const qrcode = await QrCode.generateQrCodeBase64(meta)
        const [imgDataUrl, imgDataBlob] = await mixWatermarkImg(
          localImg[0],
          qrcode
        )
        // document focus
        ref.current?.click()
        //@ts-ignore
        clipboardData.push(new ClipboardItem({ 'image/png': imgDataBlob }))
        //@ts-ignore
        await navigator.clipboard.write(clipboardData)
        publishFunc()
        setSubmitting(false)
        // await pasteShareTextToEditor();
      } else {
        message.warning('Please select local image to mint your NFT')
        return
      }
    } catch (err) {
      console.log(err)
      setSubmitting(false)
      message.error('Wallet issue/Balance issue')
    }
  }
  return (
    <div className="mint-container">
      <img src={chrome.extension.getURL('images/upload.png')} alt="" />
      <p>Select local images to mint NFT</p>
      <Upload
        capture=""
        accept=".jpg,.jpeg,.png"
        beforeUpload={beforeUpload}
        onRemove={onRemove}
        fileList={localImg}>
        <CommonButton type="primary" className="btn-upload">
          Select local image
        </CommonButton>
      </Upload>
      <div className="btn-footer">
        <CommonButton
          type="secondary"
          onClick={handleFinish}
          className="btn-finish"
          loading={submitting}>
          Finish
        </CommonButton>
      </div>
      {/* <img id="preview" src={previewLocalImg} alt="" className="preview-local" /> */}
    </div>
  )
}
