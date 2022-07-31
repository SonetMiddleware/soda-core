import {
  httpRequest,
  HttpRequestType,
  API_HOST,
  getChainName
} from '@soda/soda-util'

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

export const getNFTRelatedTwitterData = async (
  params: IGetNFTRelatedTwitterDataParams
): Promise<IGetNFTRelatedTwitterResp> => {
  if (!params.chain_name) {
    params.chain_name = await getChainName(params.chainId)
  }
  const _param = {
    nft: `${params.chain_name},${params.contract},${params.token_id}`
  }
  const url = `${API_HOST}/twitter-nft/counts`
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
    params.chain_name = await getChainName(params.chainId)
  }
  const _param: any = {
    nft: `${params.chain_name},${params.contract},${params.token_id}`,
    start: params.start
  }
  if (params.count) {
    _param.count = params.count
  }
  const url = `${API_HOST}/twitter-nft/snapshots`
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
    params.chain_name = await getChainName(params.chainId)
  }

  const url = `${API_HOST}/twitter-nft/add`
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
    params.chain_name = await getChainName(params.chainId)
  }
  const _param = {
    nft: `${params.chain_name},${params.contract},${params.token_id}`
  }
  const url = `${API_HOST}/twitter-nft`
  const res = await httpRequest({ url, params: _param })
  console.debug('[core-asset] getNFTRelatedTweet: ', params, res)
  return res.data
}
