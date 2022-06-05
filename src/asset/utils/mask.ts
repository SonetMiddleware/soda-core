import { NFT, TokenCache } from '@soda/soda-asset'
import { getChainId } from '@soda/soda-util'
import { getToken } from '../asset'

const URL_Prefix = 'https://s.plat.win?'

export const generateTokenMask = (token: NFT) => {
  return (
    URL_Prefix +
    encodeNumBase64(Number(token.chainId)) +
    '_' +
    encodeHexBase64(
      token.contract.startsWith('0x')
        ? token.contract.substr(2)
        : token.contract
    ) +
    '_' +
    encodeNumBase64(Number(token.tokenId))
  )
}

export const decodeMaskToCache = async (str: string): Promise<TokenCache> => {
  const DEFAULT_CHAINID = 80001
  const DEFAULT_CONTRACT = '0x0daB724e3deC31e5EB0a000Aa8FfC42F1EC917C5'
  if (str.includes('s.plat.win?')) {
    const data = str.split('?')
    const mask = data[1].split('_')
    if (mask.length === 3) {
      // get source tokenURI(uint tokenId)
      const chainId = decodeNumBase64(mask[0])
      const contract = '0x' + decodeHexBase64(mask[1])
      const tokenId = decodeNumBase64(mask[2]) + ''
      const cache = {
        chainId,
        contract,
        tokenId
      }
      return cache
    }
  } else {
    const resArrs = str.split('?')
    const mask =
      resArrs.length === 1 ? resArrs[0].split('_') : resArrs[1].split('_')
    if (mask.length === 2) {
      //old version
      const chainId = DEFAULT_CHAINID ? DEFAULT_CHAINID : await getChainId()
      const cache = {
        chainId,
        contract: DEFAULT_CONTRACT,
        tokenId: mask[1],
        source: mask[0]
      }
      return cache
    }
  }
  return null
}

const _base64 =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

export const encodeNumBase64 = (num: Number) => {
  return encodeHexBase64(num.toString(16))
}
export const encodeHexBase64 = (hex: string) => {
  let idx = hex.length
  let ret = ''
  while (idx >= 6) {
    let sub = parseInt(hex.substring(idx - 6, idx), 16)
    for (let i = 0; i < 4; ++i) {
      ret = _base64[sub % 64] + ret
      sub >>= 6
    }
    idx -= 6
  }
  if (idx > 0) {
    let sub = parseInt(hex.substring(0, idx), 16)
    while (sub > 0) {
      ret = _base64[sub % 64] + ret
      sub >>= 6
    }
  }
  return ret
}

export const decodeNumBase64 = (b64: string) => {
  return parseInt(decodeHexBase64(b64), 16)
}
export const decodeHexBase64 = (b64: string) => {
  let idx = b64.length,
    ret = ''
  while (idx >= 4) {
    let sub = 0
    for (let i = 0; i < 4; ++i) {
      sub <<= 6
      sub = sub + _base64.indexOf(b64[idx - 4 + i])
    }
    const h = sub.toString(16)
    ret = '000000'.substring(h.length) + h + ret
    idx -= 4
  }
  if (idx > 0) {
    let sub = 0
    for (let i = 0; i < idx; ++i) {
      sub <<= 6
      sub = sub + _base64.indexOf(b64[i])
    }
    ret = sub.toString(16) + ret
  }
  if (ret.length === 42 && ret.startsWith('00')) {
    //compatible for old version
    return ret.substring(2)
  }
  const res =
    '0000000000000000000000000000000000000000'.substring(ret.length) + ret
  return res
}
