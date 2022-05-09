import axios from 'axios'
// const BACKEND_HOST = 'http://3.36.115.102:8080/api/v';
// const BACKEND_HOST = 'https://testapi.platwin.io/api/v1';
const BACKEND_HOST = process.env.API_HOST //'https://testapi.platwin.io/api/v1';

export const BINDING_CONTENT_TITLE = 'Binding with Soda'

const SUCCESS_CODE = 0

export enum PLATFORM {
  Twitter = 'Twitter',
  Facebook = 'Facebook',
  Instgram = 'Instgram'
}
//testapi.platwin.io/api/v1/nfts?addr=0x2c4591A433FEDDeb2de7B4047E0b7389A3225faC

export interface IBindTwitterParams {
  addr: string
  tid: string
  sig: string
  platform: PLATFORM
}
export const bindTwitterId = async (params: IBindTwitterParams) => {
  const url = `${BACKEND_HOST}/bind-addr`
  const res = await axios.post(url, params)
  console.log('bindTwitterId: ', res)
  return true
}

export interface IBindPostParams {
  addr: string
  tid: string
  platform: PLATFORM
  content_id: string
}
export const bindPost = async (params: IBindPostParams) => {
  const url = `${BACKEND_HOST}/bind-addr/record`
  const res = await axios.post(url, params)
  console.log('bindPost: ', res)
  return true
}

export interface IUnbindAddrParams {
  addr: string
  tid: string
  platform: string
  sig: string
}
export const unbindAddr = async (params: IUnbindAddrParams) => {
  const url = `${BACKEND_HOST}/unbind-addr`
  const res = await axios.post(url, params)
  console.log('unbindAddr: ', res)
  return true
}

export interface IPlatformAccount {
  platform: PLATFORM
  account: string
}
export interface IGetTwitterBindResultParams {
  addr?: string
  tid?: string
}
export interface IBindResultData {
  addr: string
  tid: string
  platform: PLATFORM
  content_id?: string
}
export const getTwitterBindResult = async (
  params: IGetTwitterBindResultParams
): Promise<IBindResultData[]> => {
  const url = `${BACKEND_HOST}/bind-attr`
  if (!params.addr) {
    return []
  }
  try {
    const res = await axios.get(url, { params })
    console.log('getTwitterBindResult: ', res)
    if (res.data && res.data.data) {
      return res.data.data as IBindResultData[]
    }
    return []
  } catch (err) {
    console.log(err)
    return []
  }
}

export const getOrderByTokenId = async (tokenId: string, status?: number) => {
  const url = `${BACKEND_HOST}/orders`
  const params = { token_id: tokenId, status }
  try {
    const res = await axios.get(url, { params })
    if (res.data && res.data.data && res.data.data.length === 1) {
      return res.data.data[0]
    }
  } catch (err) {
    console.log(err)
  }
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
  const url = `${BACKEND_HOST}/nfts`
  const res = await axios.get(url, { params })
  return res.data.data
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
  const res = await axios.get(url, { params })
  return res.data.data
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
    const res = await axios.post(url, params)
    console.log('addToFav: ', res)
    return true
  } catch (err) {
    console.log(err)
    return false
  }
}

export interface IGenReferralCodeParams {
  addr: string
  platform: string
  tid: string
}

export const genReferralCode = async (
  params: IGenReferralCodeParams
): Promise<string> => {
  const url = `${BACKEND_HOST}/referral/gen`
  try {
    const res = await axios.post(url, params)
    return res.data.data
  } catch (err) {
    console.log(err)
    return ''
  }
}

export interface IAcceptReferralCodeParams {
  addr: string
  referral: string
  sig: string
}

export const acceptReferralCode = async (
  params: IAcceptReferralCodeParams
): Promise<boolean> => {
  const url = `${BACKEND_HOST}/referral/accept`
  const res = await axios.post(url, params)
  if (res.data.code === SUCCESS_CODE) {
    return true
  } else {
    return false
  }
}

export const getAcceptedReferralCode = async (
  addr: string
): Promise<string> => {
  const url = `${BACKEND_HOST}/referral/code`
  const res = await axios.get(url, {
    params: {
      addr
    }
  })
  return res.data.data
}

export const getAcceptedCount = async (code: string): Promise<number> => {
  const url = `${BACKEND_HOST}/referral/count`
  const res = await axios.get(url, {
    params: {
      code
    }
  })
  return res.data.data
}

export interface IGetMyReferralCodeParams {
  addr: string
  platform: string
  tid: string
}
export const getMyReferralCode = async (
  params: IGetMyReferralCodeParams
): Promise<string> => {
  const url = `${BACKEND_HOST}/referral`
  const res = await axios.get(url, {
    params
  })
  return res.data.data
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

export interface IDaoItem {
  name: string
  start_date: number
  total_member: number
  facebook: string
  twitter: string
  id: string
  img: ''
}
export interface IGetCollectionListResult {
  total: number
  data: ICollectionItem[]
}
export const getCollectionList = async (
  params: IGetCollectionListParams
): Promise<IGetCollectionListResult> => {
  const url = `${BACKEND_HOST}/collection-list`
  const res = await axios.get(url, {
    params
  })
  return res.data.data
}

export interface IGetCollectionNFTListParams {
  collection_id: string
  addr?: string
  page?: number
  gap?: number
}

export interface IGetCollectionNFTListResult {
  total: number
  collection_id: '' // collection id
  collection_name: '' // collection name
  collection_img: '' // collection img
  data: IOwnedNFTData[]
}
export const getCollectionNFTList = async (
  params: IGetCollectionNFTListParams
): Promise<IGetCollectionNFTListResult> => {
  const url = `${BACKEND_HOST}/collection/nfts`
  const res = await axios.get(url, {
    params
  })
  return res.data.data
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
  const url = `${BACKEND_HOST}/dao`
  const res = await axios.get(url, {
    params
  })
  return res.data.data
}

export interface IGetProposalListParams {
  dao: string
  page?: number
  gap?: number
}

export enum ProposalStatusEnum {
  SOON,
  OPEN,
  PASSED,
  NOT_PASSED
}
export enum ProposalVoteEnum {
  ADDRESS = 1,
  NFT = 2,
  SON = 3
}
export interface IProposalItem {
  id: string
  title: string
  description: string
  start_time: number
  end_time: number
  ballot_threshold: number
  status: ProposalStatusEnum // 0：等待投票开始；1: 正在投票，还没结束；2：通过了；3：没通过；
  items: string[] // 提案的各种选项
  results: number[] // 跟选项对应的投票人数
  voter_type: ProposalVoteEnum // 1: 一个地址一票，2：一个NFT一票，3：一个SON一票
}
export interface IGetProposalListResult {
  total: number
  data: IProposalItem[]
}

export const getProposalStatus = (item: IProposalItem) => {
  const now = Date.now()
  const totalVotes = item.results.reduce((a, b) => a + b)
  if (now < item.start_time) {
    return ProposalStatusEnum.SOON
  } else if (now > item.start_time && now < item.end_time) {
    return ProposalStatusEnum.OPEN
  } else if (now >= item.end_time) {
    if (totalVotes >= item.ballot_threshold) {
      return ProposalStatusEnum.PASSED
    } else {
      return ProposalStatusEnum.NOT_PASSED
    }
  }
}
export const getProposalList = async (
  params: IGetProposalListParams
): Promise<IGetProposalListResult> => {
  const url = `${BACKEND_HOST}/proposal`
  const res = await axios.get(url, {
    params
  })
  const result: any = res.data.data
  result.data.forEach((temp: any) => (temp.items = temp.items.split(',')))
  result.data.forEach(
    (temp: any) =>
      (temp.results = temp.results
        .split(',')
        .map((num: string) => parseInt(num)))
  )
  result.data.forEach((temp: any) => (temp.status = getProposalStatus(temp)))
  return result
}

interface ICreateProposalParams {
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
  const url = `${BACKEND_HOST}/proposal/create`
  const res = await axios.post(url, params)
  return true
}

export interface IVoteProposalParams {
  voter: string
  collection_id: string
  proposal_id: string
  item: string
  sig: string
}
export const voteProposal = async (params: IVoteProposalParams) => {
  const url = `${BACKEND_HOST}/proposal/vote`
  const res = await axios.post(url, params)
  return true
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
  item: string //
  votes: string //
}
export const getUserVoteInfo = async (
  params: IGetUserVoteParams
): Promise<IGetUserVoteResult | null> => {
  const url = `${BACKEND_HOST}/proposal/votes`
  const res = await axios.get(url, {
    params
  })
  return res.data.data
}

export const getCollectionWithId = async (
  id: string
): Promise<ICollectionItem | null> => {
  const url = `${BACKEND_HOST}/collection?contract=${id}`
  const res = await axios.get(url, {})
  return res.data.data || null
}
