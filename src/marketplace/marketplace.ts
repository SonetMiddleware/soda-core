import { NFT } from '@soda/soda-asset'
import { Function, invoke } from '@soda/soda-mp-sdk'
import { getAppConfig } from '@soda/soda-package-index'

export const getMarketplaceList = async () => {}
export const sell = async () => {}
export const auction = async () => {}
export const buy = async () => {}
export const withdraw = async () => {}

export const getTokenMarketplacePage = async (token: NFT) => {
  const mp = getAppConfig(token.chainId).mpService[0]
  return await invoke(mp, Function.getItemPage, { token })
}
