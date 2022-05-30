import {
  getAssetServices as assetGetServices,
  invoke,
  Function,
  TokenCache,
  NFT
} from '@soda/soda-asset'
import { store, load } from '@soda/soda-storage-sdk'
import { getCacheImage, render } from '@soda/soda-media-sdk'
import { mixWatermarkImg } from './utils/imgHandler'
import { decodeQrcodeFromImgSrc, generateQrCodeBase64 } from './utils/qrcode'
import { decodeMaskToCache, generateTokenMask } from './utils/mask'
import { getChainId } from '../account'
import { getAppConfig } from '@soda/soda-package-index'

export const getAssetServices = async (meta: {
  services?: string[]
  chainId?: number
}): Promise<{ chainId: number; names: string[] }> => {
  const { services, chainId } = meta
  const cid = chainId ? chainId : await getChainId()
  const svc = getAppConfig(cid).assetService as string[]
  let names = []
  if (services) {
    for (const s of services) {
      if (svc.includes(s)) names.push(s)
    }
  }
  if (names.length == 0) names = svc
  return { chainId: cid, names }
}

export const decodeMask = async (str: string): Promise<NFT> => {
  const cache = await decodeMaskToCache(str)
  console.debug('[core-asset] decodeMask cache: ', cache)
  const token = await getToken({ cache })
  console.debug('[core-asset] decodeMask token: ', token)
  return token
}

export const mint = async (meta: {
  storage: string
  content: string
  chainId?: number
  service?: string
  preCallback?: any
  storeCallback?: any
  mintCallback?: any
}): Promise<NFT> => {
  try {
    const {
      chainId,
      service,
      storage,
      content,
      preCallback,
      storeCallback,
      mintCallback
    } = meta
    const { names } = await getAssetServices({
      services: service ? [service] : null,
      chainId
    })
    if (preCallback) preCallback()
    const hash = await store(storage, content)
    if (storeCallback) storeCallback(hash)
    // TODO: choose better mint service for now, first service only
    const token = await invoke(names[0], Function.mint, {
      source: hash
    })
    if (mintCallback) mintCallback(token)
    return token
  } catch (e) {
    console.error(e)
    throw new Error('Error on minting ' + e)
  }
}

export const getToken = async (params: {
  cache: TokenCache
  services?: string[]
}) => {
  const { cache, services } = params
  if (cache) {
    const { names } = await getAssetServices({
      services,
      chainId: cache.chainId
    })
    console.debug('[core-asset] getToken getAssetServices: ', names)
    // FIXME: figure out better query solution, query to get the first token matched for now
    for (const svc of names) {
      try {
        const token = await invoke(svc, Function.getAssetInfo, cache)
        if (token) {
          return token
        }
      } catch (e) {
        console.error(e)
      }
    }
  }
  throw new Error('Error to get asset info ' + cache)
}

export const getRole = async (meta: { token: NFT }): Promise<NFT> => {
  try {
    const { token } = meta
    const { names } = await getAssetServices({
      chainId: token.chainId
    })
    // FIXME: use the first service only
    const { owner, minter } = await invoke(names[0], Function.getRole, token)
    token.owner = owner
    token.minter = minter
    return token
  } catch (e) {
    console.error(e)
    throw new Error('Error to get asset role info ' + e)
  }
}
export const getBalance = async (meta: {
  cache: TokenCache
  address: string
}) => {
  try {
    const { cache, address } = meta
    const { names } = await getAssetServices({
      chainId: cache.chainId
    })
    const balance = await invoke(names[0], Function.getBalance, {
      cache,
      address
    })
    return balance
  } catch (e) {
    console.error(e)
    // FIXME: handle error
    return 0
  }
}

export const loadSource = async (meta: { token: NFT; storageConfig?: any }) => {
  try {
    const { token, storageConfig } = meta
    const source = await load(token.meta.storage, {
      uri: token.source,
      config: storageConfig
    })
    return source
  } catch (e) {
    console.error(e)
    throw new Error('Error to load source ' + e)
  }
}

export const getCacheMedia = async (meta: {
  token: NFT
  storageConfig?: any
  attachInfo?: string
  withMask?: boolean
}) => {
  try {
    const { token, storageConfig, attachInfo, withMask } = meta
    const source = await load(token.meta.storage, {
      uri: token.source,
      config: storageConfig
    })
    const cacheSrc = await getCacheImage(token.meta.type, {
      source,
      attachInfo: attachInfo
    })
    if (!withMask) return cacheSrc
    const mask = generateTokenMask(token)
    const qrcode = await generateQrCodeBase64(mask)
    const [imgDataUrl, imgDataBlob] = await mixWatermarkImg(cacheSrc!, qrcode)
    return imgDataBlob
  } catch (e) {
    console.error(e)
    throw new Error('Error to get cache media ' + e)
  }
}

export const getTokenFromCacheMedia = async (imgSrc: string) => {
  if (!imgSrc) return null
  let mask: string
  try {
    mask = await decodeQrcodeFromImgSrc(imgSrc)
  } catch (e) {
    // no qrcode
    // console.error(e)
    return null
  }
  if (!mask) return null
  console.debug('[core-asset] getTokenFromCacheMedia: ', mask)
  return await decodeMask(mask || '')
}
export const getTokenSource = async (token: NFT) => {
  if (!token || !token.source) return ''
  const storageService = token.meta.storage || 'ipfs'
  // FIXME: find faster network, add market source to get quicker uri for now
  let marketSource = ''
  const conf = getAppConfig(token.chainId)
  if (token && token.chainId && conf) marketSource = conf.mpService[0]
  const source = await load(storageService, {
    uri: token.source,
    config: { uri: true, source: marketSource }
  })
  return source
}
export const renderTokenFromCacheMedia = async (
  imgSrc: string,
  meta: { dom: HTMLDivElement; config?: any }
) => {
  const token: NFT = await getTokenFromCacheMedia(imgSrc)
  return await renderToken(token, meta)
}

export const renderToken = async (
  token: NFT,
  meta: { dom: HTMLDivElement; config?: any }
) => {
  const res = { token, result: false }
  if (!token) return res
  const { dom, config } = meta
  const source = await getTokenSource(token)
  if (!source) return res
  const mediaType = token.meta.type || 'image'
  res.result = await render(mediaType, {
    source,
    dom: dom,
    config: config
  })
  return res
}

export const transfer = async () => {}
export const destroy = async () => {}

export const outlook = async () => {}
export const getAvailableTools = async () => {}

export { TokenCache, NFT }
