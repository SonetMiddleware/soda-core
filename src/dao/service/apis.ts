import { NFT } from '@soda/soda-asset'
import {
  invokeWeb3Api,
  HttpRequestType,
  httpRequest,
  getChainId,
  API_HOST,
  getChainName
} from '@soda/soda-util'
import { ProposalStatusEnum, ProposalVoteEnum } from '../const'

const SUCCESS_CODE = 0

export interface IDaoItem {
  name: string
  start_date: number
  total_member: number
  facebook: string
  twitter: string
  id: string
  img: string
  isMyDao?: boolean
  centralized: number
  tags: string[]
  types: string[]
  status: string
}
export interface ICollectionItem {
  id: string
  name: string
  img: string
  dao: IDaoItem
}
export interface IGetDaoListParams {
  addr?: string
  name?: string
  page: number
  gap: number
  chain_name?: string
}
export interface IGetDaoListResult {
  total: number
  data: IDaoItem[]
}
export const getDaoList = async (
  params: IGetDaoListParams
): Promise<IGetDaoListResult> => {
  const url = `${API_HOST}/dao`
  const chain_name = await getChainName()
  params.chain_name = chain_name
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

export const getProposalPermission = async (
  dao: string,
  address: string
): Promise<boolean> => {
  const url = `${API_HOST}/proposal/permission`
  const chain_name = await getChainName()
  const params = {
    dao,
    addr: address,
    chain_name
  }
  const res = await httpRequest({ url, params })
  console.debug('[core-dao] getProposalPermission: ', res)
  // FIXME: handle error
  return res.data
}

export interface IGetProposalListParams {
  dao: string
  page?: number
  gap?: number
  chain_name?: string
}
export interface IGetProposalListResult {
  total: number
  data: IProposalItem[]
}
export const getProposalList = async (
  params: IGetProposalListParams
): Promise<IGetProposalListResult> => {
  const url = `${API_HOST}/proposal`
  const chain_name = await getChainName()
  params.chain_name = chain_name
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
  chain_name?: string
}
export const createProposal = async (params: ICreateProposalParams) => {
  const url = `${API_HOST}/proposal/create`
  const chain_name = await getChainName()
  params.chain_name = chain_name
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
  chain_name?: string
}
export const vote = async (params: IVoteProposalParams) => {
  const url = `${API_HOST}/proposal/vote`
  const chain_name = await getChainName()
  params.chain_name = chain_name
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
  const url = `${API_HOST}/proposal/votes`
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
  chain_name?: string
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
  const url = `${API_HOST}/collection-list`
  const chain_name = await getChainName()
  params.chain_name = chain_name
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
  const url = `${API_HOST}/collection`
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
  const url = `${API_HOST}/collection/${id}`
  const res = await httpRequest({ url })
  console.debug('[core-dao] getCollectionDaoByCollectionId: ', res)
  // FIXME: handle error
  if (res.error) return null
  return res.data || null
}
