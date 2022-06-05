import { NFT } from '@soda/soda-asset'
import { getChainId, httpRequest, HttpRequestType } from '@soda/soda-util'

// hard code for now
const HOST_MAP: Record<number, string> = {
  80001: 'https://testapi2.platwin.io:49336/api/v1',
  4: 'https://testapi3.platwin.io:59336/api/v1',
  1: 'https://api.platwin.io:8081/api/v1'
}
const getHost = async (meta?: NFT | number): Promise<string> => {
  let chainId = 0
  if (meta) {
    if (typeof meta == 'number') chainId = meta
    else chainId = (meta as NFT).chainId
  } else chainId = await getChainId()
  if (!HOST_MAP[chainId])
    throw new Error(
      '[asset-platwin] getHost error, unsupported chainId: ' + chainId
    )
  return HOST_MAP[chainId]
}

export interface IGetOwnedNFTParams {
  addr: string
  contract?: string
  token_id?: string
  page?: number
  gap?: number
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
  const url = `${await getHost()}/nfts`
  const res = await httpRequest({ url, params })
  console.debug('[core-asset] getOwnedNFT: ', params, res)
  // FIXME: handle error
  if (res.error) return { total: 0, data: [] }
  return res.data
}

export interface IGetFavNFTParams {
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
  const url = `${await getHost()}/favorite`
  const res = await httpRequest({ url, params })
  console.debug('[core-asset] getFavNFT: ', params, res)
  // FIXME: handle error
  if (res.error) return { total: 0, data: [] }
  return res.data
}

export interface IAddToFavParams {
  addr: string
  contract: string
  token_id: string
  uri: string
  fav: number // 0 or 1
}
export const addToFav = async (params: IAddToFavParams) => {
  const url = `${await getHost()}/favorite-nft`
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
  const url = `${await getHost()}/collection/nfts`
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
