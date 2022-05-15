import React, { useState, useEffect, useCallback } from 'react'
import './index.less'
import { Spin, Radio, Pagination as AntdPagination, message } from 'antd'
import ImgDisplay from '../../ImgDisplay'
import CommonButton from '../../Button'
import type { IOwnedNFTData } from '../../../utils/apis'
import { getOwnedNFT } from '../../../utils/apis'
import * as QrCode from '../../../utils/qrcode'
import { mixWatermarkImg } from '../../../utils/imgHandler'
import { generateMetaForQrcode, PlatwinContracts } from '@/utils/utils'
import { getChainId } from '@/utils/messageHandler'

interface IProps {
  account: string
  publishFunc?: () => void
}

export default (props: IProps) => {
  const { account, publishFunc } = props
  const [ownedNFTs, setOwnedNFTs] = useState<IOwnedNFTData[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedImg, setSelectedImg] = useState<number>()
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [submitting, setSubmitting] = useState(false)

  const fetchOwnedList = useCallback(
    async (page: number) => {
      if (account) {
        try {
          setLoading(true)
          const params = {
            addr: account,
            page,
            gap: 9
          }
          const nfts = await getOwnedNFT(params)
          console.log('ownedNFTs: ', nfts)
          setOwnedNFTs([])
          setOwnedNFTs(nfts.data)
          setTotal(nfts.total)
          setPage(page)
          setLoading(false)
        } catch (err) {
          setLoading(false)
        }
      }
    },
    [account]
  )

  const handleChangePage = (page: number) => {
    fetchOwnedList(page)
  }

  const handleFinish = async () => {
    const clipboardData = []
    if (selectedImg !== undefined) {
      try {
        setSubmitting(true)
        const selectedImgObj = ownedNFTs[selectedImg]
        const { uri, token_id } = selectedImgObj
        // const meta = `${uri}_${token_id}`
        const chainId = await getChainId()
        const meta = generateMetaForQrcode(chainId, selectedImgObj.contract, Number(token_id))
        console.log('meta: ', meta)
        // create watermask
        const imgUrl = uri.startsWith('http')
          ? uri
          : `https://${uri}.ipfs.dweb.link/`
        const qrcode = await QrCode.generateQrCodeBase64(meta)
        const [imgDataUrl, imgDataBlob] = await mixWatermarkImg(imgUrl, qrcode)
        //@ts-ignore
        clipboardData.push(new ClipboardItem({ 'image/png': imgDataBlob }))
        message.success(
          'Your NFT is minted and copyed. Please paste into the new post dialog',
          5
        )
        // trigger document focus
        // ref.current?.click();
        document.body.click()
        //@ts-ignore
        await navigator.clipboard.write(clipboardData)
        setSubmitting(false)
        // await pasteShareTextToEditor();
        publishFunc && publishFunc()
      } catch (err) {
        console.log(err)
        setSubmitting(false)
      }
    } else {
      message.warning('Please select one NFT')
      return
    }
  }

  useEffect(() => {
    fetchOwnedList(1)
  }, [])

  return (
    <div className="owned-list-container">
      <Spin spinning={loading}>
        <p className="title">Select one of your NFTs to share</p>
        <Radio.Group
          className="list-container"
          onChange={(e) => {
            setSelectedImg(e.target.value)
          }}
          value={selectedImg}>
          {ownedNFTs.map((item, index) => (
            <Radio value={index} key={item.uri}>
              <div className="item-detail">
                <ImgDisplay
                  className="img-item"
                  src={
                    item.uri.startsWith('http')
                      ? item.uri
                      : `https://${item.uri}.ipfs.dweb.link/`
                  }
                />

                <p className="item-name">#{item.token_id}</p>
              </div>
            </Radio>
          ))}
        </Radio.Group>
        <div className="list-pagination">
          <AntdPagination
            total={total}
            pageSize={9}
            onChange={handleChangePage}
            current={page}
          />
        </div>
        <div className="list-footer">
          <CommonButton
            type="secondary"
            onClick={handleFinish}
            className="btn-finish"
            loading={submitting}>
            Attach
          </CommonButton>
        </div>
      </Spin>
    </div>
  )
}
