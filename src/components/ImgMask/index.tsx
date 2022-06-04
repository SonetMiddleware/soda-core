import React, { useState, useEffect, useMemo } from 'react'
import * as ReactDOM from 'react-dom'
import './index.less'
import {
  MessageTypes,
  sendMessage,
  getMinter,
  getOwner,
  getUserAccount,
  getChainId
} from '../../utils/messageHandler'
import {
  getTwitterBindResult,
  getOrderByTokenId,
  addToFav,
  getFavNFT,
  PLATFORM,
  IBindResultData,
  ICollectionItem,
  retrieveAssets,
  retrieveAsset,
  IDaoItem,
  getCollectionWithContract
} from '../../utils/apis'
import { Popover, message, Button, Modal } from 'antd'
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
import IconDao from '../../assets/images/icon-dao.svg'
import IconProposal from '../../assets/images/icon-proposal.svg'
import IconMinterOwner from '../../assets/images/icon-minter-owner.png'
import ProposalModal from '../ProposalModal'
import { IconShareFB, IconShareTwitter } from './icon'

import {
  delay,
  generateMetaForQrcode,
  isMainNet,
  MAINNET_CHAIN_ID
} from '../../utils/utils'
import { getStorageService } from '@soda/soda-storage-sdk'
import { NFTInfo } from '@soda/soda-asset'
const PlatwinMEME2WithoutRPC = '0x0daB724e3deC31e5EB0a000Aa8FfC42F1EC917C5'

function ImgMask(props: {
  meta: NFTInfo
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
  const [isCurrentMainnet, setIsCurrentMainNet] = useState(false)
  const [account, setAccount] = useState('')
  const [owner, setOwner] = useState('')
  const [minter, setMinter] = useState('')
  const [collection, setCollection] = useState<ICollectionItem>()
  const [dao, setDao] = useState<IDaoItem>()
  const [currentChainId, setCurrentChainId] = useState()
  const [proposalModalShow, setProposalModalShow] = useState(false)
  const { chainId, contract, tokenId, source } = props.meta
  const { username } = props
  console.log('props.meta: ', props.meta)

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

  const fetchInfo = async (isMain: boolean) => {
    console.log('>>>>>>>>>>>>>fetchInfo: ', tokenId)
    const ownerAddress = await getOwner(contract, tokenId)
    let minterAddress = ''
    if (!isMain) {
      minterAddress = await getMinter(tokenId)
    }

    console.log('ownerAddress: ', ownerAddress, tokenId)
    console.log('minterAddress: ', minterAddress, tokenId)
    setOwner(ownerAddress)
    setMinter(minterAddress)

    const ownerBindResult =
      (await getTwitterBindResult({
        addr: ownerAddress
      })) || []
    const bindings = ownerBindResult.filter((item) => item.content_id)
    console.log('ownerBindings: ', bindings)

    setOwnerPlatformAccount(bindings)
    if (minterAddress) {
      const minterBindResult =
        (await getTwitterBindResult({
          addr: minterAddress
        })) || []
      const minterBindings = minterBindResult.filter((item) => item.content_id)
      setMinterPlatformAccount(minterBindings)
      console.log('minterBindings: ', minterBindings)
    }

    const order = await getOrderByTokenId(tokenId)
    console.log('order: ', order)

    if (order) {
      setOrderId(order.order_id)
    }
  }

  useEffect(() => {
    ;(async () => {
      const currentChainId = await getChainId()
      setCurrentChainId(currentChainId)
      const addr = await getUserAccount()
      setAccount(addr)
      const isMain = await isMainNet()
      setIsCurrentMainNet(isMain)
      console.log('userAccount: ', addr)
      if (tokenId) {
        await fetchInfo(isMain)
        const favNFTs = await getFavNFT({
          addr,
          contract: contract
        })
        if (
          favNFTs &&
          favNFTs.data &&
          favNFTs.data.some((item) => item.token_id === Number(tokenId))
        ) {
          setIsInFav(true)
        }
        fetchCollectionInfo()
      }
    })()
  }, [props.meta])

  const getPlatformUserHomepage = (data: IBindResultData[]) => {
    for (const item of data) {
      if (item.platform === PLATFORM.Twitter) {
        const url = `https://www.twitter.com/${item.tid}`
        return url
      }
    }

    if (data[0] && data[0].platform === PLATFORM.Facebook) {
      const url = `https://www.facebook.com/${data[0].tid}`
      return url
    }
  }

  const toMinterTwitter = (e) => {
    e.stopPropagation()
    if (minterPlatformAccount[0]) {
      const url = getPlatformUserHomepage(minterPlatformAccount)
      window.open(url, '_blank')
    }
  }
  const toOwnerTwitter = (e) => {
    e.stopPropagation()
    if (ownerPlatformAccount[0]) {
      const url = getPlatformUserHomepage(ownerPlatformAccount)
      window.open(url, '_blank')
    }
  }
  const handleToMarket = (e) => {
    e.stopPropagation()
    if (props.meta.chainId === 4) {
      window.open(
        `https://testnets.opensea.io/assets/rinkeby/${props.meta.contract}/${props.meta.tokenId}`
      )
    } else if (props.meta.chainId === 1) {
      window.open(
        `https://opensea.io/assets/ethereum/${props.meta.contract}/${props.meta.tokenId}`
      )
    } else if (props.meta.chainId === 137) {
      window.open(
        `https://opensea.io/assets/matic/${props.meta.contract}/${props.meta.tokenId}`
      )
    } else if (orderId) {
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
    // const hash = await ipfsAdd(props.originImgSrc)
    const hash = getStorageService('ipfs').storeFunc(props.originImgSrc)
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
      'Your NFT is minted and copied. Please paste into the new post dialog',
      5
    )
    setMintLoading(false)
    // 2. create meta
    const chainId = await getChainId()
    const meta = generateMetaForQrcode(chainId, PlatwinMEME2WithoutRPC, tokenId)
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
    const metaStr = generateMetaForQrcode(chainId, contract, Number(tokenId))
    await saveLocal(StorageKeys.SHARING_NFT_META, metaStr)
    const targetUrl = window.location.href.includes('twitter')
      ? 'https://www.facebook.com'
      : 'https://www.twitter.com'
    window.open(targetUrl, '_blank')
  }

  const shareContent = () => (
    <div className="img-mask-share">
      <ul>
        <li>
          <IconShareTwitter
            onClick={handleShare}
            disabled={window.location.href.includes('twitter')}
          />
        </li>
        <li>
          <IconShareFB
            disabled={window.location.href.includes('facebook')}
            onClick={handleShare}
          />
        </li>
      </ul>
    </div>
  )
  const handleAddToFav = async (e) => {
    e.stopPropagation()
    try {
      const addr = await getUserAccount()
      const params = {
        addr,
        contract: contract,
        token_id: tokenId,
        fav: 1,
        uri: source
      }
      await addToFav(params)
      setIsInFav(true)
      message.success('Add to favorite succed!')
    } catch (err) {
      console.log(err)
      message.error('Add to favorite failed.')
    }
  }

  const fetchCollectionInfo = async () => {
    const collection = await getCollectionWithContract(contract) // TODO:get contract from meta
    setCollection(collection)
    if (collection.dao) {
      setDao(collection.dao)
    }
  }

  const toDaoPage = async (e: any) => {
    e.stopPropagation()
    const uri = `daoDetail?dao=${collection.id}`
    const req = {
      type: MessageTypes.Open_OptionPage,
      request: {
        uri
      }
    }
    sendMessage(req)
  }

  const onCloseProposalModal = () => {
    setProposalModalShow(false)
  }

  const toProposal = (e: any) => {
    e.stopPropagation()
    setProposalModalShow(true)
  }

  return (
    <div className="img-mask-container">
      <div className="img-mask-icon">
        {!isCurrentMainnet && !tokenId && (
          <Popover content="Mint">
            <FontAwesomeIcon
              style={{ cursor: 'pointer' }}
              icon={faHamburger}
              onClick={(e) => {
                e.stopPropagation()
                handleMint()
              }}
            />
          </Popover>
        )}

        {tokenId && !showMenuMore && (
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
            {tokenId && (
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
            {tokenId && source && (
              <Popover content="View source">
                <div
                  className="toolbar-icon"
                  onClick={(e) => {
                    e.stopPropagation()
                    const url =
                      source && source.startsWith('http')
                        ? source
                        : `https://${source}.ipfs.dweb.link/`
                    window.open(url, '_blank')
                  }}>
                  <img src={IconSource} alt="" />
                </div>
              </Popover>
            )}
            {tokenId && source && (
              <Popover
                placement="bottom"
                title={'Share'}
                content={shareContent}
                trigger="hover"
                overlayClassName="toolbar-share"
                className="toolbar-share">
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

            {Number(chainId) === Number(currentChainId) &&
              account &&
              tokenId &&
              !isInFav && (
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
            {dao && (
              <Popover content="DAO">
                <div className="toolbar-icon" onClick={toDaoPage}>
                  <img src={IconDao} alt="" />
                </div>
              </Popover>
            )}
            {dao && (
              <Popover content="Proposal">
                <div className="toolbar-icon" onClick={toProposal}>
                  <img src={IconProposal} alt="" />
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
              <img src={IconMinterOwner} />
            </div>
          </Popover>
        )}
      </div>
      <ProposalModal
        show={proposalModalShow}
        onClose={onCloseProposalModal}
        collection={collection}
        contract={contract}
      />
    </div>
  )
}

export default ImgMask
