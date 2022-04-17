import imageKitInit from '@soda/soda-image-kit'
import { getMediaTypes } from '@soda/soda-media-sdk'

import ipfsKitInit from '@soda/soda-ipfs-kit'
import { getStorageService } from '@soda/soda-storage-sdk'

import nashmarketInit from '@soda/soda-nashmarket'
import { getMarketPlaces } from '@soda/soda-mp-sdk'

import { registerChain } from './utils/chains'

import BindTwitterIdBox from './components/BindTwitterIdBox'
import Button from './components/Button'
import ImgDisplay from './components/ImgDisplay'
import ImgMask from './components/ImgMask'
import ResourceDialog from './components/ResourceDialog'
import FavNFTList from './components/ResourceDialog/FavNFTList'
import OwnedNFTList from './components/ResourceDialog/OwnedNFTList'
import UploadNFT from './components/ResourceDialog/UploadNFT'

export {
  BindTwitterIdBox,
  Button,
  ImgDisplay,
  ImgMask,
  ResourceDialog,
  FavNFTList,
  OwnedNFTList,
  UploadNFT
}

export * from './utils/apis'
export * from './utils/handleShare'
export * from './utils/imgHandler'
export * from './utils/messageHandler'
export * from './utils/qrcode'
export * from './utils/storage'
export * from './utils/watcher'
export * from './utils/eventDispatch'
export * from './utils/utils'
export * from './utils/ipfsHandler'

const initialize = () => {
  imageKitInit()
  ipfsKitInit()
  nashmarketInit()

  registerChain({
    name: 'eth-mainnet',
    meta: {
      chainid: 1,
      rpc: 'https://mainnet.infura.io/v3/',
      symbol: 'ETH',
      explorer: 'https://etherscan.io'
    }
  })
  registerChain({
    name: 'HECO',
    meta: {
      chainid: 128,
      rpc: 'https://http-mainnet.hecochain.com',
      symbol: 'HT',
      explorer: 'https://scan.hecochain.com'
    }
  })
}

export default initialize
