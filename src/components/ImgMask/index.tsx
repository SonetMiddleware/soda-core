import React, { useState, useEffect, useMemo } from 'react'
import './index.less'
import {
  MessageTypes,
  sendMessage,
  getMinter,
  getOwner,
  getUserAccount
} from '../../utils/messageHandler'
import {
  getTwitterBindResult,
  getOrderByTokenId,
  addToFav,
  getFavNFT,
  PLATFORM,
  IBindResultData
} from '../../utils/apis'
import { Popover, message, Button } from 'antd'
import { ipfsAdd } from '../../utils/ipfsHandler'
import { mixWatermarkImg } from '../../utils/imgHandler'
import * as QrCode from '../../utils/qrcode'
import { ArrowRightOutlined } from '@ant-design/icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHamburger } from '@fortawesome/free-solid-svg-icons'
import { saveLocal, StorageKeys } from '../../utils/storage'
import { newPostTrigger } from '../../utils/handleShare'
import IconExpand from '../../assets/images/icon-expand.png'
import IconShrink from '../../assets/images/icon-shrink.png'
import IconFav from '../../assets/images/icon-fav.png'
import IconMarket from '../../assets/images/icon-market.png'
import IconMinterRole from '../../assets/images/icon-minter-role.png'
import IconMinter from '../../assets/images/icon-minter.png'
import IconOwnerRole from '../../assets/images/icon-owner-role.png'
import IconOwner from '../../assets/images/icon-owner.png'
import IconShare from '../../assets/images/icon-share.png'
import IconSource from '../../assets/images/icon-source.png'
// import { pasteShareTextToEditor } from '../../utils/utils'

const PlatwinMEME2WithoutRPC = '0x0daB724e3deC31e5EB0a000Aa8FfC42F1EC917C5'

function ImgMask(props: {
  meta: string[]
  originImgSrc: string
  username: string
}) {
  const [orderId, setOrderId] = useState('')
  const [isInFav, setIsInFav] = useState(false)
  const [mintLoading, setMintLoading] = useState(false)
  const [showMenuMore, setShowMenuMore] = useState(false)
  const [minterPlatformAccount, setMinterPlatformAccount] = useState<
    IBindResultData[]
  >([])
  const [ownerPlatformAccount, setOwnerPlatformAccount] = useState<
    IBindResultData[]
  >([])
  const [account, setAccount] = useState('')
  const [owner, setOwner] = useState('')
  const [minter, setMinter] = useState('')

  const [hash, tokenId] = props.meta
  const { username } = props
  console.log('props.meta: ', props.meta)
  const ipfsOrigin = `https://${hash}.ipfs.dweb.link/`

  const isOwner = useMemo(() => {
    if (ownerPlatformAccount.find((item) => item.tid === username)) {
      return true
    } else {
      return false
    }
  }, [username, ownerPlatformAccount])

  const isMinter = useMemo(() => {
    if (minterPlatformAccount.find((item) => item.tid === username)) {
      return true
    } else {
      return false
    }
  }, [minterPlatformAccount, username])

  const isBothMinterOwner = useMemo(() => {
    console.log('isBothMinterOwner: ', isOwner, isMinter)
    return isOwner && isMinter
  }, [isOwner, isMinter])

  const fetchInfo = async () => {
    console.log('>>>>>>>>>>>>>fetchInfo: ', tokenId)
    const addr = await getUserAccount()
    const ownerAddress = await getOwner(tokenId)
    const minterAddress = await getMinter(tokenId)
    console.log('userAccount: ', addr, tokenId)
    console.log('ownerAddress: ', ownerAddress, tokenId)
    console.log('minterAddress: ', minterAddress, tokenId)
    setOwner(ownerAddress)
    setMinter(minterAddress)
    setAccount(addr)

    const ownerBindResult =
      (await getTwitterBindResult({
        addr: ownerAddress
      })) || []
    const bindings = ownerBindResult.filter((item) => item.content_id)
    console.log('ownerBindings: ', bindings)

    setOwnerPlatformAccount(bindings)
    const minterBindResult =
      (await getTwitterBindResult({
        addr: minterAddress
      })) || []
    const minterBindings = minterBindResult.filter((item) => item.content_id)
    setMinterPlatformAccount(minterBindings)
    console.log('minterBindings: ', minterBindings)

    const order = await getOrderByTokenId(tokenId)
    console.log('order: ', order)

    if (order) {
      setOrderId(order.order_id)
    }
  }

  useEffect(() => {
    ;(async () => {
      if (props.meta && props.meta.length > 1) {
        fetchInfo()
        const addr = await getUserAccount()
        setAccount(addr)
        const favNFTs = await getFavNFT({
          addr,
          contract: PlatwinMEME2WithoutRPC
        })
        if (favNFTs.data.some((item) => item.token_id === Number(tokenId))) {
          setIsInFav(true)
        }
      }
    })()
  }, [props.meta])

  const getPlatformUserHomepage = (data: IBindResultData) => {
    if (data.platform === PLATFORM.Facebook) {
      const url = `https://www.facebook.com/${data.tid}`
      return url
    } else if (data.platform === PLATFORM.Twitter) {
      const url = `https://twitter.com/${data.tid}`
      return url
    }
  }

  const toMinterTwitter = (e) => {
    e.stopPropagation()
    if (minterPlatformAccount[0]) {
      const url = getPlatformUserHomepage(minterPlatformAccount[0])
      window.open(url, '_blank')
    }
  }
  const toOwnerTwitter = (e) => {
    e.stopPropagation()
    if (ownerPlatformAccount[0]) {
      const url = getPlatformUserHomepage(ownerPlatformAccount[0])
      window.open(url, '_blank')
    }
  }
  const handleToMarket = (e) => {
    e.stopPropagation()
    if (orderId) {
      window.open(`https://nash.market/detail/${orderId}`, '_blank')
    } else {
      window.open(`http://nash.market/detail/-1`, '_blank')
    }
  }
  const handleMint = async () => {
    if (!account) {
      message.warning('Wallet not found. Please install metamask.')
      return
    }
    setMintLoading(true)
    // 1. upload to ipfs
    message.info('Uploading your resource to IPFS...', 5)
    const hash = await ipfsAdd(props.originImgSrc)
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
      setMintLoading(false)
      return
    }
    message.success(
      'Your NFT is minted and copyed. Please paste into the new post dialog',
      5
    )
    setMintLoading(false)
    // 2. create meta
    // t for twitter
    const meta = `${hash}_${tokenId}`
    console.log('meta: ', meta)
    // 4. create watermask
    const qrcode = await QrCode.generateQrCodeBase64(meta)
    const [imgDataUrl, imgDataBlob] = await mixWatermarkImg(
      props.originImgSrc,
      qrcode
    )
    const clipboardData = []
    document.body.click()
    //@ts-ignore
    clipboardData.push(new ClipboardItem({ 'image/png': imgDataBlob }))
    //@ts-ignore
    await navigator.clipboard.write(clipboardData)
    newPostTrigger()
    // await pasteShareTextToEditor()
  }

  const handleShare = async () => {
    await saveLocal(StorageKeys.SHARING_NFT_META, props.meta.join('_'))
    const targetUrl = window.location.href.includes('twitter')
      ? 'https://www.facebook.com'
      : 'https://www.twitter.com'
    window.open(targetUrl, '_blank')
  }

  const shareContent = () => (
    <div className="img-mask-share">
      <ul>
        <li>
          <Button
            type="link"
            target="_blank"
            disabled={window.location.href.includes('twitter')}
            onClick={handleShare}>
            Share to Twitter <ArrowRightOutlined />{' '}
          </Button>
        </li>
        <li>
          <Button
            type="link"
            target="_blank"
            disabled={window.location.href.includes('facebook')}
            onClick={handleShare}>
            Share to Facebook <ArrowRightOutlined />{' '}
          </Button>
        </li>
        {/* <li>
                    <a href="" target="_blank" >Share to Instagram <ArrowRightOutlined /> </a>
                </li> */}
      </ul>
    </div>
  )
  const handleAddToFav = async (e) => {
    e.stopPropagation()
    try {
      const addr = await getUserAccount()
      const params = {
        addr,
        contract: PlatwinMEME2WithoutRPC,
        token_id: tokenId,
        fav: 1,
        uri: hash
      }
      await addToFav(params)
      setIsInFav(true)
      message.success('Add to favorite succed!')
    } catch (err) {
      console.log(err)
      message.error('Add to favorite failed.')
    }
  }

  return (
    <div className="img-mask-container">
      <div className="img-mask-icon">
        {props.meta.length === 0 && (
          <Popover content="Mint">
            <FontAwesomeIcon
              icon={faHamburger}
              onClick={(e) => {
                e.stopPropagation()
                handleMint()
              }}
            />
          </Popover>
        )}

        {props.meta.length > 0 && !showMenuMore && (
          <Popover content="Expand toolbar">
            <div
              className="toolbar-icon"
              onClick={(e) => {
                e.stopPropagation()
                setShowMenuMore(true)
              }}>
              <img src={IconExpand} alt="" />
            </div>
          </Popover>
        )}

        {showMenuMore && (
          <div className="img-mask-icon-list" style={{ display: 'flex' }}>
            {props.meta.length > 0 && (
              <Popover content="Shrink toolbar">
                <div
                  className="toolbar-icon"
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowMenuMore(false)
                  }}>
                  <img src={IconShrink} alt="" />
                </div>
              </Popover>
            )}
            {props.meta.length > 0 && (
              <Popover content="View source">
                <div
                  className="toolbar-icon"
                  onClick={(e) => {
                    e.stopPropagation()
                    window.open(ipfsOrigin, '_blank')
                  }}>
                  <img src={IconSource} alt="" />
                </div>
              </Popover>
            )}
            {props.meta.length > 0 && (
              <Popover
                placement="bottom"
                title={'Share'}
                content={shareContent}
                trigger="hover">
                <div className="toolbar-icon">
                  <img src={IconShare} alt="" />
                </div>
              </Popover>
            )}

            {
              <Popover content={'To NFT market'}>
                <div className="toolbar-icon" onClick={handleToMarket}>
                  <img src={IconMarket} alt="" />
                </div>
              </Popover>
            }

            {account && props.meta.length > 0 && !isInFav && (
              <Popover content="Add to fav">
                <div className="toolbar-icon" onClick={handleAddToFav}>
                  <img src={IconFav} alt="" />
                </div>
              </Popover>
            )}

            {!isBothMinterOwner && !isOwner && ownerPlatformAccount.length > 0 && (
              <Popover content="View owner">
                <div className="toolbar-icon" onClick={toOwnerTwitter}>
                  <img src={IconOwner} alt="" />
                </div>
              </Popover>
            )}
            {!isBothMinterOwner &&
              !isMinter &&
              minterPlatformAccount.length > 0 && (
                <Popover content="View minter">
                  <div className="toolbar-icon" onClick={toMinterTwitter}>
                    <img src={IconMinter} alt="" />
                  </div>
                </Popover>
              )}
          </div>
        )}
        {!isBothMinterOwner && isOwner && (
          <Popover content="This is the owner">
            <div className="toolbar-icon" onClick={toOwnerTwitter}>
              <img src={IconOwnerRole} alt="" />
            </div>
          </Popover>
        )}
        {!isBothMinterOwner && isMinter && (
          <Popover content="This is the minter">
            <div className="toolbar-icon" onClick={toMinterTwitter}>
              <img src={IconMinterRole} alt="" />
            </div>
          </Popover>
        )}
        {isBothMinterOwner && (
          <Popover content="This is the minter & owner">
            <div className="toolbar-icon" onClick={toMinterTwitter}>
              <svg
                width="17"
                height="18"
                viewBox="0 0 17 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M7.2514 10.6147V17.1467H0C0 15.4143 0.763985 13.7529 2.12389 12.5279C3.48379 11.3029 5.32821 10.6147 7.2514 10.6147V10.6147ZM12.69 16.7385L10.026 18L10.5345 15.3284L8.3799 13.4357L11.3584 13.0454L12.69 10.6147L14.0224 13.0454L17 13.4357L14.8454 15.3284L15.353 18L12.69 16.7385ZM7.2514 9.79814C4.2466 9.79814 1.81285 7.60581 1.81285 4.89907C1.81285 2.19233 4.2466 0 7.2514 0C10.2562 0 12.69 2.19233 12.69 4.89907C12.69 7.60581 10.2562 9.79814 7.2514 9.79814Z"
                  fill="url(#paint0_linear_64:366)"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_64:366"
                    x1="8.5"
                    y1="0"
                    x2="8.5"
                    y2="18"
                    gradientUnits="userSpaceOnUse">
                    <stop stop-color="#FF9A46" />
                    <stop offset="0.489583" stop-color="#FF67C1" />
                    <stop offset="0.973958" stop-color="#9D5FE9" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </Popover>
        )}
      </div>
    </div>
  )
}

export default ImgMask
