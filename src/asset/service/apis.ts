import { IDaoItem } from '@/dao/service/apis'
import { httpRequest, HttpRequestType } from '@soda/soda-util'

const BACKEND_HOST = process.env.API_HOST

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
  const url = `${BACKEND_HOST}/nfts`
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
  const url = `${BACKEND_HOST}/favorite`
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
  const url = `${BACKEND_HOST}/favorite-nft`
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

export interface IGetCollectionListParams {
  addr: string
  page?: number
  gap?: number
}
export interface ICollectionItem {
  id: string
  name: string
  img: string
  dao: IDaoItem
}
export interface IGetCollectionListResult {
  total: number
  data: ICollectionItem[]
}
export const getCollectionList = async (
  params: IGetCollectionListParams
): Promise<IGetCollectionListResult> => {
  const url = `${BACKEND_HOST}/collection-list`
  const res = await httpRequest({ url, params })
  console.debug('[core-asset] getCollectionList: ', params, res)
  // FIXME: handle error
  if (res.error) return { total: 0, data: [] }
  return res.data
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
  const url = `${BACKEND_HOST}/collection/nfts`
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

export const getCollectionById = async (
  id: string
): Promise<ICollectionItem | null> => {
  const url = `${BACKEND_HOST}/collection?contract=${id}`
  const res = await httpRequest({ url })
  console.debug('[core-asset] getCollectionById: ', res)
  // FIXME: handle error
  if (res.error) return null
  return res.data
}
