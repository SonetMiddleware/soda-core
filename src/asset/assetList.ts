import { AssetType, NFT } from '@soda/soda-asset'
import { getChainId } from '@soda/soda-util'
import * as Api from './service/apis'

export const getAssetList = async () => {}
export const getAssetDetail = async () => {}

// backward compatible
const DEFAULT_CHAINID = 80001
const DEFAULT_TOKENCONTRACT = '0x0daB724e3deC31e5EB0a000Aa8FfC42F1EC917C5'

export const toToken = (t: Api.IOwnedNFTData, chainId?: number): NFT => {
  return {
    type: t.erc == '1155' ? AssetType.PFT : AssetType.NFT,
    balance: t.amount,
    chainId: chainId ? chainId : DEFAULT_CHAINID,
    contract: t.contract,
    tokenId: t.token_id,
    source: t.uri,
    owner: t.owner,
    meta: { type: 'image', storage: 'ipfs' }
  }
}
export const getOwnedTokens = async (params: {
  address: string
  chainId?: number
  contract?: string
  tokenId?: string
  page?: number
  gap?: number
}): Promise<{
  total: number
  data: NFT[]
}> => {
  const { address, chainId: cid, contract, tokenId, page, gap } = params
  const chainId = cid ? cid : await getChainId()
  const tokens = await Api.getOwnedNFT({
    addr: address,
    // TODO: add chain id
    contract,
    token_id: tokenId,
    page,
    gap
  })
  const res = { total: tokens.total, data: [] }

  for (const t of tokens.data) {
    res.data.push(toToken(t, cid))
  }
  return res
}

export const getFavTokens = async (params: {
  address: string
  chainId?: number
  contract?: string
  page?: number
  gap?: number
}): Promise<{ total: number; data: NFT[] }> => {
  const { address, chainId: cid, contract: c, page, gap } = params
  const chainId = cid ? cid : await getChainId()
  const contract = c ? c : DEFAULT_TOKENCONTRACT
  const tokens = await Api.getFavNFT({
    addr: address,
    // TODO: add chain id
    contract,
    page,
    gap
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
