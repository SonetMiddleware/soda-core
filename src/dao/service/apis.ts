import { NFT } from '@soda/soda-asset'
import {
  invokeWeb3Api,
  HttpRequestType,
  httpRequest,
  getChainId
} from '@soda/soda-util'
import { ProposalStatusEnum, ProposalVoteEnum } from '../const'

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

const SUCCESS_CODE = 0

export interface IDaoItem {
  name: string
  start_date: number
  total_member: number
  facebook: string
  twitter: string
  id: string
  img: string
}
export interface ICollectionItem {
  id: string
  name: string
  img: string
  dao: IDaoItem
}
export interface IGetDaoListParams {
  addr?: string
  page: number
  gap: number
}
export interface IGetDaoListResult {
  total: number
  data: IDaoItem[]
}
export const getDaoList = async (
  params: IGetDaoListParams
): Promise<IGetDaoListResult> => {
  const url = `${await getHost()}/dao`
  const res = await httpRequest({ url, params })
  console.debug('[core-dao] getDaoList: ', res)
  // FIXME: handle error
  if (res.error) return { total: 0, data: [] }
  return res.data
}

export interface IProposalItem {
  id: string
  title: string
  description: string
  start_time: number
  snapshot_block: number
  end_time: number
  ballot_threshold: number
  status: ProposalStatusEnum
  items: string[] // vote options
  results: number[] // votes
  voter_type: ProposalVoteEnum // 1: one vote per address, 2: one vote per NFT, 3: on vote per SON
}
export const getProposalStatus = (
  item: IProposalItem,
  blockheight?: Number
): ProposalStatusEnum => {
  const now = Date.now()
  const totalVotes = item.results.reduce((a, b) => a + b)
  if (item.items.length === 1 && totalVotes >= item.ballot_threshold) {
    return ProposalStatusEnum.VALID
  }
  if (now < item.start_time) {
    return ProposalStatusEnum.SOON
  } else if (now > item.start_time && now < item.end_time) {
    return item.snapshot_block <= blockheight
      ? ProposalStatusEnum.OPEN
      : ProposalStatusEnum.SOON
  } else if (now >= item.end_time) {
    if (totalVotes >= item.ballot_threshold) {
      return ProposalStatusEnum.VALID
    } else {
      return ProposalStatusEnum.INVALID
    }
  }
}

export interface IGetProposalListParams {
  dao: string
  page?: number
  gap?: number
}
export interface IGetProposalListResult {
  total: number
  data: IProposalItem[]
}
export const getProposalList = async (
  params: IGetProposalListParams
): Promise<IGetProposalListResult> => {
  const url = `${await getHost()}/proposal`
  const res = await httpRequest({ url, params })
  console.debug('[core-dao] getProposalList: ', res)
  // FIXME: handle error
  if (res.error) return { total: 0, data: [] }
  const result = res.data
  result.data.forEach((temp: any) => (temp.items = temp.items.split(',')))
  result.data.forEach(
    (temp: any) =>
      (temp.results = temp.results
        .split(',')
        .map((num: string) => parseInt(num)))
  )
  //get current block height
  const blockRes: any = await invokeWeb3Api({
    module: 'eth',
    method: 'getBlockNumber'
  })
  const { result: currentBlockHeight } = blockRes

  result.data.forEach(
    (temp: any) => (temp.status = getProposalStatus(temp, currentBlockHeight))
  )
  return result
}

export interface ICreateProposalParams {
  creator: string
  snapshot_block: number
  collection_id: string
  title: string
  description: string
  start_time: number
  end_time: number
  ballot_threshold: number
  items: string
  voter_type: number
  sig: string
}
export const createProposal = async (params: ICreateProposalParams) => {
  const url = `${await getHost()}/proposal/create`
  const res = await httpRequest({ url, params, type: HttpRequestType.POST })
  console.debug('[core-dao] createProposal: ', res)
  return res
}

export interface IVoteProposalParams {
  voter: string
  collection_id: string
  proposal_id: string
  item: string
  sig: string
}
export const vote = async (params: IVoteProposalParams) => {
  const url = `${await getHost()}/proposal/vote`
  const res = await httpRequest({ url, params, type: HttpRequestType.POST })
  console.debug('[core-dao] vote: ', res)
  if (res.error || res.code !== SUCCESS_CODE) {
    return false
  } else {
    return true
  }
}

export interface IGetUserVoteParams {
  proposal_id: string
  collection_id: string
  addr: string
}
export interface IGetUserVoteResult {
  collection_id: string
  id: string
  voter: string
  item: string
  votes: string
}
export const getUserVoteInfo = async (
  params: IGetUserVoteParams
): Promise<IGetUserVoteResult | null> => {
  const url = `${await getHost()}/proposal/votes`
  const res = await httpRequest({ url, params })
  console.debug('[core-dao] getUserVoteInfo: ', res)
  // FIXME: handle error
  if (res.error) return null
  return res.data
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
  const url = `${await getHost()}/collection-list`
  const res = await httpRequest({ url, params })
  console.debug('[core-dao] getCollectionList: ', params, res)
  // FIXME: handle error
  if (res.error) return { total: 0, data: [] }
  return res.data
}

export const getCollectionDaoByContract = async (params: {
  contract: string
  chainId?: number
}): Promise<ICollectionItem | null> => {
  const { contract, chainId } = params
  const url = `${await getHost(chainId)}/collection`
  const p = { contract }
  const res = await httpRequest({ url, params: p })
  console.debug('[core-dao] getCollectionDaoByContract: ', res)
  // FIXME: handle error
  if (res.error) return null
  return res.data || null
}

export const getCollectionDaoByCollectionId = async (params: {
  id: string
  chainId?: number
}): Promise<ICollectionItem | null> => {
  const { id, chainId } = params
  const url = `${await getHost(chainId)}/collection/${id}`
  const res = await httpRequest({ url })
  console.debug('[core-dao] getCollectionDaoByCollectionId: ', res)
  // FIXME: handle error
  if (res.error) return null
  return res.data || null
}
