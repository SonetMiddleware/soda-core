// import { pasteTextToCompositionFacebook } from '@/contentScripts/facebook/utils/handleShare';
import { isNull, noop } from 'lodash-es'
import { saveLocal, getLocal, StorageKeys } from './storage'
import { CustomEvents } from './eventDispatch'
import { MessageTypes, sendMessage } from './messageHandler'
// import * as moment from 'moment'
const moment = require('moment')

/**
 * index starts at one.
 */
export function regexMatch(
  str: string,
  regexp: RegExp,
  index?: number
): string | null
export function regexMatch(
  str: string,
  regexp: RegExp,
  index: null
): RegExpMatchArray | null
export function regexMatch(
  str: string,
  regexp: RegExp,
  index: number | null = 1
) {
  const r = str.match(regexp)
  if (isNull(r)) return null
  if (index === null) {
    return r as RegExpMatchArray as any
  }
  return r[index] as string as any
}

let twitterIdGlobal = ''
let facebookIdGlobal = ''
export const getTwitterId = async () => {
  if (!twitterIdGlobal) {
    const twitterId = await getLocal(StorageKeys.TWITTER_NICKNAME)
    twitterIdGlobal = twitterId
  }
  return twitterIdGlobal
}

export const getFacebookId = async () => {
  if (!facebookIdGlobal) {
    const faceboodId = await getLocal(StorageKeys.FACEBOOK_ID)
    facebookIdGlobal = faceboodId
  }
  return facebookIdGlobal
}

export const twitterUrl = {
  hostIdentifier: 'twitter.com',
  hostLeadingUrl: 'https://twitter.com',
  hostLeadingUrlMobile: 'https://mobile.twitter.com'
}

export const isMobileTwitter =
  location.hostname === twitterUrl.hostLeadingUrlMobile.substr(8) ||
  !!navigator.userAgent.match(/Mobile|mobile/)
export const twitterDomain = isMobileTwitter
  ? 'https://mobile.twitter.com/'
  : 'https://twitter.com/'

export const CustomEventId = 'abcf4ff0ce64-6fea93e2-1ce4-442f-b2f9'

export function dispatchCustomEvents<T extends keyof CustomEvents>(
  element: Element | Document | null = document,
  event: T,
  ...x: CustomEvents[T]
) {
  document.dispatchEvent(
    new CustomEvent(CustomEventId, { detail: JSON.stringify([event, x]) })
  )
}

export const EXTENSION_LINK = 'https://s.plat.win?'

export const POST_SHARE_TEXT =
  '$!Please visit https://s.plat.win to download the latest Chrome extension!$'

export const removeTextInSharePost = (dom: HTMLElement) => {
  const text = 'https://s.plat.win'
  const elements = dom.querySelectorAll('a')
  const targetAs = Array.prototype.filter.call(elements, function (element) {
    return RegExp(text).test(element.innerText)
  })
  // text.replace(/\$\!.*\!\$/g, '');
  targetAs.forEach((item) => {
    while (item.tagName !== 'DIV') {
      item = item.parentElement
    }
    item.innerText = item.innerText.replace(/\$\!.*\!\$/g, '')
  })
}

export const PlatwinContracts = {
  PlatwinMEME2WithoutRPC: {
    80001: '0x0daB724e3deC31e5EB0a000Aa8FfC42F1EC917C5',
    137: ''
  }
}
const URL_Prefix = 'https://s.plat.win?'

export const generateMetaForQrcode = (
  chainID: Number,
  contract: string,
  tokenId: Number
) => {
  return (
    URL_Prefix +
    encodeNumBase64(Number(chainID)) +
    '_' +
    encodeHexBase64(contract.startsWith('0x') ? contract.substr(2) : contract) +
    '_' +
    encodeNumBase64(Number(tokenId))
  )
}

export type IDocodedMetaData = {
  chainId: number
  contract: string
  tokenId: string
  source: string
}

export const decodeMetaData = async (
  meta: string
): Promise<IDocodedMetaData> => {
  const DEFAULT_CHAINID = 80001
  const DEFAULT_CONTRACT = '0x0daB724e3deC31e5EB0a000Aa8FfC42F1EC917C5'
  if (meta.includes(URL_Prefix)) {
    const data = meta.split('?')
    const metadata = data[1].split('_')
    if (metadata.length === 3) {
      // get source tokenURI(uint tokenId)
      const chainId = decodeNumBase64(metadata[0])
      const contract = '0x' + decodeHexBase64(metadata[1])
      const tokenId = decodeNumBase64(metadata[2]) + ''
      const req = {
        type: MessageTypes.InvokeERC721Contract,
        request: {
          contract,
          method: 'tokenURI',
          readOnly: true,
          args: [tokenId]
        }
      }
      const res: any = await sendMessage(req)
      console.log('InvokeERC721Contract: ', res)
      let source = res.result
      if (!source.startsWith('http')) {
        source = `https://${source}.ipfs.dweb.link/`
      }
      return {
        chainId: Number(chainId),
        contract,
        tokenId,
        source
      }
    }
  } else {
    const resArrs = meta.split('?')
    const metaData =
      resArrs.length === 1 ? resArrs[0].split('_') : resArrs[1].split('_')
    if (metaData.length === 2) {
      //old version

      return {
        chainId: Number(DEFAULT_CHAINID),
        contract: DEFAULT_CONTRACT,
        tokenId: metaData[1],
        source: `https://${metaData[0]}.ipfs.dweb.link/`
      }
    }
  }
  return {
    chainId: DEFAULT_CHAINID,
    contract: '',
    tokenId: '',
    source: ''
  }
}

export const formatDate = (datetime?: number) => {
  return datetime ? moment(datetime).format('DD/MM/YYYY') : ''
}

export const formatDateTime = (datetime: number) => {
  return moment(datetime).format('YYYY-MM-DD HH:mm:ss')
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
  console.log(ret)
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
  console.log('0000000000000000000000000000000000000000', ret)
  const res =
    '0000000000000000000000000000000000000000'.substring(ret.length) + ret
  console.log(res)
  return res
}
