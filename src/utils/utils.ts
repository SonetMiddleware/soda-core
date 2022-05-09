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

export const generateMetaForQrcode = (
  chainID: number,
  contract: string,
  tokenId: number | string
) => {
  const url = 's.plat.win?'
  return (
    url +
    Buffer.from(String(chainID)).toString('base64') +
    '_' +
    Buffer.from(contract.substring(2)).toString('base64') +
    '_' +
    Buffer.from(String(tokenId)).toString('base64')
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
  const url = 's.plat.win?'
  const DEFAULT_CHAINID = 80001
  const DEFAULT_CONTRACT = '0x0daB724e3deC31e5EB0a000Aa8FfC42F1EC917C5'
  if (meta.includes(url)) {
    const data = meta.split('?')
    const metadata = data[1].split('_')
    if (metadata.length === 3) {
      // get source tokenURI(uint tokenId)
      const chainId = Buffer.from(metadata[0], 'base64').toString('utf-8')
      const contract =
        '0x' + Buffer.from(metadata[1], 'base64').toString('utf-8')
      const tokenId = Buffer.from(metadata[2], 'base64').toString('utf-8')
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
