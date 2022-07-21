import { AssetType, Function, invoke, NFT } from '@soda/soda-asset'
import { getChainId } from '@soda/soda-util'
import { getAssetServices } from './asset'
import * as Api from './service/apis'

export const getAssetList = async () => {}
export const getAssetDetail = async () => {}

export const getOwnedTokens = async (params: {
  address: string
  chainId?: number
  contract?: string
  tokenId?: string
  offset?: number
  limit?: number
}): Promise<{
  total: number
  data: NFT[]
}> => {
  try {
    const { names } = await getAssetServices({
      chainId: params.chainId
    })
    if (names.length <= 0) throw new Error('No getOwnedTokens service found.')
    // TODO: choose better mint service for now, first service only
    const tokens = await invoke(names[0], Function.getOwnedTokens, params)
    return tokens
  } catch (e) {
    console.error(e)
    throw new Error('Error on getOwnedTokens ' + e)
  }
}

export const getFavTokens = async (params: {
  address: string
  chainId?: number
  contract?: string
  offset?: number
  limit?: number
}): Promise<{ total: number; data: NFT[] }> => {
  const { address, chainId: cid, contract, offset, limit } = params
  let page: number
  if (offset && limit && limit > 0) page = Math.floor(offset / limit) + 1
  const chainId = cid ? cid : await getChainId()
  const tokens = await Api.getFavNFT({
    addr: address,
    // TODO: add chain id
    contract,
    page,
    gap: limit
  })
  const res = { total: tokens.total, data: [] }
  for (const t of tokens.data) {
    const token: NFT = {
      type: AssetType.NFT,
      balance: 1,
      chainId,
      contract: t.contract,
      tokenId: '' + t.token_id,
      source: t.uri,
      meta: { type: 'image', storage: 'ipfs' }
    }
    if (t.isOwned) token.owner = t.addr
    if (t.isMinted) token.minter = t.addr
    res.data.push(token)
  }
  return res
}

const setTokenFav = async (params: {
  address: string
  token: NFT
  fav: number // 0 or 1
}): Promise<boolean> => {
  const { address, token, fav } = params
  return Api.addToFav({
    addr: address,
    // TODO: add chain id
    contract: token.contract,
    token_id: token.tokenId,
    uri: token.source,
    fav: fav
  })
}
export const addTokenToFav = async (params: {
  address: string
  token: NFT
}): Promise<boolean> => {
  const { address, token } = params
  return setTokenFav({ address, token, fav: 1 })
}
export const removeTokenFromFav = async (params: {
  address: string
  token: NFT
}): Promise<boolean> => {
  const { address, token } = params
  return setTokenFav({ address, token, fav: 0 })
}
