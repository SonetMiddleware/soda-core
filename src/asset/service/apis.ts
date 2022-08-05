import { NFT } from '@soda/soda-asset'
import {
  getChainId,
  httpRequest,
  HttpRequestType,
  API_HOST,
  getChainName
} from '@soda/soda-util'

export interface IGetOwnedNFTParams {
  addr: string
  contract?: string
  token_id?: string
  page?: number
  gap?: number
  chain_name?: string
}
export interface IOwnedNFTData {
  // collection_id: ''; // collection id
  // collection_name: ''; // collection name
  contract: string // contract address
  erc: string // 1155 or 721
  token_id: string //
  amount: number //
  uri: string //
  owner: string //
  update_block: string //
}
export interface IOwnedNFTResp {
  total: number
  data: IOwnedNFTData[]
}
export const getOwnedNFT = async (
  params: IGetOwnedNFTParams
): Promise<IOwnedNFTResp> => {
  if (!params.addr) {
    return {
      total: 0,
      data: []
    }
  }
  const url = `${API_HOST}/nfts`
  const chain_name = await getChainName()
  params.chain_name = chain_name
  const res = await httpRequest({ url, params })
  console.debug('[core-asset] getOwnedNFT: ', params, res)
  // FIXME: handle error
  if (res.error) return { total: 0, data: [] }
  return res.data
}

export interface IGetFavNFTParams {
  chain_name?: string
  addr: string
  contract?: string
  page?: number
  gap?: number
}
export interface IFavNFTData {
  addr: string
  contract: string
  token_id: number
  uri: string
  isOwned?: boolean
  isMinted?: boolean
}
export interface IFavNFTResp {
  total: number
  data: IFavNFTData[]
}
export const getFavNFT = async (
  params: IGetFavNFTParams
): Promise<IFavNFTResp> => {
  if (!params.addr) {
    return {
      total: 0,
      data: []
    }
  }
  const chain_name = await getChainName()
  const url = `${API_HOST}/favorite`
  params.chain_name = chain_name
  const res = await httpRequest({ url, params })
  console.debug('[core-asset] getFavNFT: ', params, res)
  // FIXME: handle error
  if (res.error) return { total: 0, data: [] }
  return res.data
}

export interface IAddToFavParams {
  chain_name?: string
  addr: string
  contract: string
  token_id: string
  uri: string
  fav: number // 0 or 1
}
export const addToFav = async (params: IAddToFavParams) => {
  const url = `${API_HOST}/favorite-nft`
  const chain_name = await getChainName()
  params.chain_name = chain_name
  try {
    const res = await httpRequest({ url, params, type: HttpRequestType.POST })
    console.debug('[core-asset] addToFav: ', params, res)
    if (res.error) return false
    return true
  } catch (err) {
    console.error(err)
    return false
  }
}

export interface IGetCollectionNFTListParams {
  collection_id: string
  addr?: string
  page?: number
  gap?: number
  chain_name?: string
}
export interface IGetCollectionNFTListResult {
  total: number
  collection_id: string // collection id
  collection_name: string // collection name
  collection_img: string // collection img
  data: IOwnedNFTData[]
}
export const getCollectionNFTList = async (
  params: IGetCollectionNFTListParams
): Promise<IGetCollectionNFTListResult> => {
  const url = `${API_HOST}/collection/nfts`
  const chain_name = await getChainName()
  params.chain_name = chain_name
  const res = await httpRequest({ url, params })
  console.debug('[core-asset] getCollectionNFTList: ', params, res)
  // FIXME: handle error
  if (res.error)
    return {
      total: 0,
      collection_id: '0x0000000000000000000000000000000000000000',
      collection_name: 'NA',
      collection_img: '',
      data: []
    }
  return res.data
}
