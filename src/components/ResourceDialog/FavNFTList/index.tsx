import React, { useEffect, useState } from 'react'
import { Radio, message, Button, Pagination, Input, Spin } from 'antd'
import './index.less'
import type { IFavNFTData } from '../../../utils/apis'
import { addToFav, getFavNFT } from '../../../utils/apis'
import CommonButton from '../../Button'
import ImgDisplay from '../../ImgDisplay'
import * as QrCode from '../../../utils/qrcode'
// import { pasteShareTextToEditor } from '../../../utils/utils'
import { mixWatermarkImg } from '../../../utils/imgHandler'
import { getMinter, getOwner } from '../../../utils/messageHandler'

interface IProps {
  account: string
  publishFunc?: () => void
}
export default (props: IProps) => {
  const { account, publishFunc } = props
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [favNFTs, setFavNFTs] = useState<IFavNFTData[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [selectedImg, setSelectedImg] = useState<number>()

  const fetchFavList = async (currentPage: number) => {
    if (account) {
      setLoading(true)
      const params = {
        addr: account,
        page: currentPage,
        gap: 9
      }
      const nfts = await getFavNFT(params)
      console.log('favNFTs: ', nfts)
      setTotal(nfts.total)
      const _nfts = []
      for (const item of nfts.data) {
        item.isMinted = false
        item.isOwned = false
        const ownerAddress = await getOwner(String(item.token_id))
        const minterAddress = await getMinter(String(item.token_id))
        if (ownerAddress === item.addr) {
          item.isOwned = true
        }
        if (minterAddress === item.addr) {
          item.isMinted = true
        }
        _nfts.push({ ...item })
      }

      console.log('favNFTs: ', _nfts)
      setLoading(false)
      setFavNFTs([])
      setFavNFTs([..._nfts])
      setPage(currentPage)
    }
  }

  const handleChangePage = (newPage: number, pageSize: number | undefined) => {
    fetchFavList(newPage)
  }

  const handleFinish = async () => {
    const clipboardData = []
    if (selectedImg !== undefined) {
      try {
        setSubmitting(true)
        const selectedObj = favNFTs[selectedImg]
        const { uri, token_id } = selectedObj
        const meta = `${uri}_${token_id}`
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
        // setShow(false);
        publishFunc()
        // await pasteShareTextToEditor()
      } catch (err) {
        console.log(err)
        setSubmitting(false)
      }
    } else {
      message.warning('Please select one NFT')
      return
    }
  }

  const handleRemoveFav = async (item: IFavNFTData, index: number) => {
    const params = {
      addr: item.addr,
      contract: item.contract || '0x0daB724e3deC31e5EB0a000Aa8FfC42F1EC917C5',
      token_id: String(item.token_id),
      fav: 0, //remove fav
      uri: item.uri
    }
    await addToFav(params)
    message.success('Remove favorite succed!')
    // const index = favNFTs.findIndex((n) => item.token_id === n.token_id);
    if (index > -1) {
      // favNFTs.splice(index, 1);
      // setFavNFTs([...favNFTs]);
      fetchFavList(page)
    }
  }

  useEffect(() => {
    fetchFavList(1)
  }, [])

  return (
    <div className="fav-list-container">
      <p className="title">Select one of your favorite NFTs to share</p>
      <div className="search-header">
        <Input
          type="text"
          placeholder="Input search text"
          className="input-search"
        />
        <img
          className="icon-view"
          src={chrome.extension.getURL('images/icon-view.png')}
          alt=""
        />
        <img
          className="icon-filter"
          src={chrome.extension.getURL('images/icon-filter.png')}
          alt=""
        />
      </div>
      <Spin spinning={loading}>
        <Radio.Group
          className="list-container"
          onChange={(e) => {
            setSelectedImg(e.target.value)
          }}
          value={selectedImg}>
          {favNFTs.map((item, index) => (
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

                <div className="item-name-tags">
                  <p className="item-name">#{item.token_id}</p>
                  <p className="item-tags">
                    {item.isMinted && <span className="item-minted" />}

                    {item.isOwned && <span className="item-owned" />}
                  </p>
                </div>
                {!item.isOwned && !item.isMinted && (
                  <div className="item-btns">
                    <Button
                      size="small"
                      className="btn-remove"
                      onClick={() => handleRemoveFav(item, index)}>
                      Remove
                    </Button>
                  </div>
                )}
              </div>
            </Radio>
          ))}
        </Radio.Group>
        <div className="list-pagination">
          <Pagination
            total={total}
            pageSize={9}
            onChange={handleChangePage}
            current={page}
          />
        </div>
        <div className="list-footer">
          <div className="tags-tips">
            <p>
              <span className="item-minted" />
              <span>Created</span>
            </p>
            <p>
              <span className="item-owned" />
              <span>Owned</span>
            </p>
          </div>
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
