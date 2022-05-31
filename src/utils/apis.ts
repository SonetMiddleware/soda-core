import axios from 'axios'
import { getChainId } from '../utils/messageHandler'
// const BACKEND_HOST = 'http://3.36.115.102:8080/api/v';
// const BACKEND_HOST = 'https://testapi.platwin.io/api/v1';

const Host_Map: Record<number, string> = {
  80001: 'https://testapi2.platwin.io:49336/api/v1',
  4: 'https://testapi3.platwin.io:59336/api/v1',
  1: 'https://api.platwin.io:8081/api/v1'
}
let BACKEND_HOST = '' //'https://testapi.platwin.io/api/v1';
getChainId().then((chainId) => {
  BACKEND_HOST = Host_Map[chainId]
})

async function getBackHostFirst() {
  if (!BACKEND_HOST) {
    await getChainId()
  }
}

export const BINDING_CONTENT_TITLE = 'Binding with Soda (https://s.plat.win)'

export const SUCCESS_CODE = 0

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
  const url = `${Host_Map[80001]}/bind-addr`
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
  await getBackHostFirst()
  const url = `${Host_Map[80001]}/bind-addr/record`
  const res = await axios.post(url, params)
  console.log('bindPost: ', res)
  if (res.data.code === SUCCESS_CODE) {
    return true
  } else {
    return false
  }
}

export interface IUnbindAddrParams {
  addr: string
  tid: string
  platform: string
  sig: string
}
export const unbindAddr = async (params: IUnbindAddrParams) => {
  await getBackHostFirst()
  const url = `${Host_Map[80001]}/unbind-addr`
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
  await getBackHostFirst()
  const url = `${Host_Map[80001]}/bind-attr`
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
  await getBackHostFirst()
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
  amount?: number //
  uri: string //
  owner: string //
  update_block?: string //
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
  await getBackHostFirst()
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
  await getBackHostFirst()
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
  await getBackHostFirst()
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
  await getBackHostFirst()
  const url = `${Host_Map[80001]}/referral/gen`
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
  await getBackHostFirst()
  const url = `${Host_Map[80001]}/referral/accept`
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
  await getBackHostFirst()
  const url = `${Host_Map[80001]}/referral/code`
  const res = await axios.get(url, {
    params: {
      addr
    }
  })
  return res.data.data
}

export const getAcceptedCount = async (code: string): Promise<number> => {
  await getBackHostFirst()
  const url = `${Host_Map[80001]}/referral/count`
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
  await getBackHostFirst()
  const url = `${Host_Map[80001]}/referral`
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
  dao?: IDaoItem
}

export interface IDaoItem {
  name: string
  start_date: number
  total_member: number
  facebook: string
  twitter: string
  id: string
  img: string
  isMyDao?: boolean
}
export interface IGetCollectionListResult {
  total: number
  data: ICollectionItem[]
}
export const getCollectionList = async (
  params: IGetCollectionListParams
): Promise<IGetCollectionListResult> => {
  await getBackHostFirst()
  const url = `${BACKEND_HOST}/collection-list`
  const res = await axios.get(url, {
    params
  })
  const result = res.data.data as IGetCollectionListResult
  result.data.forEach((item) => {
    if (item.dao) {
      item.dao.img = item.img
      item.dao.id = item.id
    }
  })
  return result
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
): Promise<IGetCollectionNFTListResult | null> => {
  await getBackHostFirst()
  const url = `${BACKEND_HOST}/collection/nfts`
  try {
    const res = await axios.get(url, {
      params
    })
    if (res.data.code === SUCCESS_CODE) {
      return res.data.data
    }
    return null
  } catch (e) {
    console.log(e)
    return null
  }
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
  await getBackHostFirst()
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
  VALID,
  INVALID
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
  snapshot_block: number
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
  if (item.items.length === 1 && totalVotes >= item.ballot_threshold) {
    return ProposalStatusEnum.VALID
  }
  if (now < item.start_time) {
    return ProposalStatusEnum.SOON
  } else if (now > item.start_time && now < item.end_time) {
    return ProposalStatusEnum.OPEN
  } else if (now >= item.end_time) {
    if (totalVotes >= item.ballot_threshold) {
      return ProposalStatusEnum.VALID
    } else {
      return ProposalStatusEnum.INVALID
    }
  }
}
export const getProposalList = async (
  params: IGetProposalListParams
): Promise<IGetProposalListResult> => {
  await getBackHostFirst()
  const url = `${BACKEND_HOST}/proposal`
  const res = await axios.get(url, {
    params
  })
  const result: any = res.data.data
  result.data.forEach((temp: any) => {
    temp.items = temp.items.split(',')
    temp.results = temp.results.split(',').map((num: string) => parseInt(num))
  })
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
  await getBackHostFirst()
  const url = `${BACKEND_HOST}/proposal/create`
  const res = await axios.post(url, params)
  return res
}

export interface IVoteProposalParams {
  voter: string
  collection_id: string
  proposal_id: string
  item: string
  sig: string
}
export const voteProposal = async (params: IVoteProposalParams) => {
  await getBackHostFirst()
  const url = `${BACKEND_HOST}/proposal/vote`
  const res = await axios.post(url, params)
  if (res.data.code === SUCCESS_CODE) {
    return true
  } else {
    return false
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
  item: string //
  votes: string //
}
export const getUserVoteInfo = async (
  params: IGetUserVoteParams
): Promise<IGetUserVoteResult | null> => {
  await getBackHostFirst()
  const url = `${BACKEND_HOST}/proposal/votes`
  const res = await axios.get(url, {
    params
  })
  return res.data.data
}

export const getCollectionWithContract = async (
  contract: string
): Promise<ICollectionItem | null> => {
  await getBackHostFirst()
  const url = `${BACKEND_HOST}/collection?contract=${contract}`
  const res = await axios.get(url, {})
  return res.data.data || null
}

export const getCollectionWithCollectionId = async (
  id: string
): Promise<ICollectionItem | null> => {
  await getBackHostFirst()
  const url = `${BACKEND_HOST}/collection/${id}`
  const res = await axios.get(url, {})
  return res.data.data || null
}

export interface IRetrieveCollectionsParam {
  owner_address: string
  offset?: number
  limit?: number
  isMainnet?: boolean
}

export const retrieveCollections = async (
  params: IRetrieveCollectionsParam
): Promise<IGetCollectionListResult> => {
  const url = `https://${
    params.isMainnet ? '' : 'testnets-'
  }api.opensea.io/api/v1/collections?asset_owner=${
    params.owner_address
  }&offset=${params.offset || 0}&limit=${params.limit || 300}`

  const res: any = await axios.get(url)
  console.log('retrieveCollections: ', res)
  const result = {
    total: res.data.length,
    data: res.data.map((item: any) => ({
      id: item.slug,
      name: item.name,
      img: item.image_url,
      dao: null
    }))
  }
  return result
}

export interface IRetrieveAssetsParams {
  owner: string
  offset?: number
  limit?: number
  collection: string
  isMainnet?: boolean
}
export const retrieveAssets = async (
  params: IRetrieveAssetsParams
): Promise<IGetCollectionNFTListResult> => {
  const url = `https://${
    params.isMainnet ? '' : 'testnets-'
  }api.opensea.io/api/v1/assets?owner=${
    params.owner
  }&order_direction=desc&offset=${params.offset || 0}&limit=${
    params.limit || 50
  }${params.collection ? '&collection=' + params.collection : ''}`
  const res: any = await axios.get(url)
  console.log('retrieveAssets: ', res)

  const assets: any[] = res.data.assets
  const result = {
    total: assets.length,
    collection_id: params.collection,
    collection_name: assets[0]?.collection.name,
    collection_img: assets[0]?.collection.image_url,
    data: assets.map((item) => ({
      contract: item?.asset_contract.address,
      erc: item?.asset_contract.schema_name,
      token_id: item.token_id,
      uri: item.image_url || item.asset_contract.image_url,
      owner: item?.owner.address,
      name: item.asset_contract.name
    }))
  }
  return result
}
const CachedAssetResult = {}
export const retrieveAsset = async (
  contract: string,
  tokenId: string,
  isMainnet: boolean = false
) => {
  const key = `${contract}_${tokenId}`
  if (CachedAssetResult[key]) {
    return CachedAssetResult[key]
  }
  const url = `https://${
    isMainnet ? '' : 'testnets-'
  }api.opensea.io/api/v1/asset/${contract}/${tokenId}/
  `
  const res: any = await axios.get(url)
  const asset = res.data
  if (!CachedAssetResult[key]) {
    CachedAssetResult[key] = asset
  }
  return asset
}
