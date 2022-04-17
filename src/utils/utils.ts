// import { pasteTextToCompositionFacebook } from '@/contentScripts/facebook/utils/handleShare';
import { isNull, noop } from 'lodash-es'
import { saveLocal, getLocal, StorageKeys } from './storage'
import { CustomEvents } from './eventDispatch'
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
