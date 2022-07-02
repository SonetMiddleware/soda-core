import { NFT } from '@soda/soda-asset'
import { Function, invoke } from '@soda/soda-mp-sdk'
import { getAppConfig } from '@soda/soda-package-index'
import { getChainId } from '../account'

export const getMarketplaceList = async () => {}
export const sell = async () => {}
export const auction = async () => {}
export const buy = async () => {}
export const withdraw = async () => {}

export const getInlineMarketplace = async (meta?: number | NFT) => {
  let chainId = 0
  let token = null
  if (meta) {
    if (typeof meta == 'number' || typeof meta == 'string')
      chainId = Number(meta)
    else {
      chainId = meta.chainId
      token = meta
    }
  }
  const cid = chainId ? chainId : await getChainId()
  console.log('[core-mp] getInlineMarketplace: ', cid)
  try {
    const svc = getAppConfig(cid).mpService
    for (const s of svc) {
      let url = ''
      if (token) {
        url = await invoke(s, 'getItemPage', { token })
      } else {
        url = await invoke(s, 'getHost', { chainId: cid })
      }
      return { url }
    }
  } catch (e) {
    console.error('[core-mp] getInlineMarketplace: ', e)
  }
  // TODO: to add more info
  return { url: '' }
}
