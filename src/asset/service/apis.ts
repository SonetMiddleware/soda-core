import { getChainName } from '@/util'
import { NFT } from '@soda/soda-asset'
import { getChainId, httpRequest, HttpRequestType } from '@soda/soda-util'

// hard code for now
const HOST_MAP: Record<number, string> = {
  80001: 'https://testapi2.platwin.io:49336/api/v1',
  4: 'https://testapi3.platwin.io:59336/api/v1',
  1: 'https://api.platwin.io:8081/api/v1',
  137: 'https://matic-api.platwin.io:8082/api/v1'
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

export interface IGetNFTRelatedTwitterDataParams {
  chain_name?: string
  chainId?: number
  contract: string
  token_id: number
}
export interface IGetNFTRelatedTwitterResp {
  retweet_count: number
  reply_count: number
  like_count: number
  quote_count: number
}
const NFT_DATA_HOST = 'https://apiv2-test.platwin.io/api/v1'
export const getNFTRelatedTwitterData = async (
  params: IGetNFTRelatedTwitterDataParams
): Promise<IGetNFTRelatedTwitterResp> => {
  if (!params.chain_name) {
    params.chain_name = getChainName(params.chainId)
  }
  const _param = {
    nft: `${params.chain_name},${params.contract},${params.token_id}`
  }
  const url = `${NFT_DATA_HOST}/twitter-nft/counts`
  const res = await httpRequest({ url, params: _param })
  console.debug('[core-asset] getNFTRelatedTwitterData: ', params, res)
  return res.data
}

export interface IGetTwitterDailyDataParams {
  chain_name?: string
  chainId?: number
  contract: string
  token_id: number
  start: string // "2022-07-15 16:51:00"
  count?: number // max 100, default 50
}
export interface IGetTwitterDailyDataResp {
  start: string
  data: {
    snapshot_time: string
    retweet_count: number
    reply_count: number
    like_count: number
    quote_count: number
  }[]
}
export const getTwitterDailyData = async (
  params: IGetTwitterDailyDataParams
): Promise<IGetTwitterDailyDataResp> => {
  if (!params.chain_name) {
    params.chain_name = getChainName(params.chainId)
  }
  const _param: any = {
    nft: `${params.chain_name},${params.contract},${params.token_id}`,
    start: params.start
  }
  if (params.count) {
    _param.count = params.count
  }
  const url = `${NFT_DATA_HOST}/twitter-nft/snapshots`
  const res = await httpRequest({ url, params: _param })
  console.debug('[core-asset] getTwitterDailyData: ', params, res)
  return res.data
}

export interface ITraceTwitterForNFTParams {
  chainId?: number
  chain_name?: string
  contract: string
  token_id: string
  tid: string
  user_img: string
  user_id: string
  user_name: string
  t_content: string
}

export const traceTwitterForNFT = async (params: ITraceTwitterForNFTParams) => {
  if (!params.chain_name) {
    params.chain_name = getChainName(params.chainId)
  }

  const url = `${NFT_DATA_HOST}/twitter-nft/add`
  const res = await httpRequest({ url, params, type: HttpRequestType.POST })
  console.debug('[core-asset] traceTwitterForNFT: ', params, res)
  return res.data
}

export interface IGetNFTRelatedTweetData {
  chain_name: string
  contract: string
  token_id: string
  tid: string
  user_img: string
  user_id: string
  user_name: string
  t_content: string
}

export const getNFTRelatedTweet = async (
  params: IGetNFTRelatedTwitterDataParams
): Promise<IGetNFTRelatedTweetData[]> => {
  if (!params.chain_name) {
    params.chain_name = getChainName(params.chainId)
  }
  const _param = {
    nft: `${params.chain_name},${params.contract},${params.token_id}`
  }
  const url = `${NFT_DATA_HOST}/twitter-nft`
  const res = await httpRequest({ url, params: _param })
  console.debug('[core-asset] getNFTRelatedTweet: ', params, res)
  return res.data
}
