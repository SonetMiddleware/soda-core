import axios from 'axios'
// const BACKEND_HOST = 'http://3.36.115.102:8080/api/v';
// const BACKEND_HOST = 'https://testapi.platwin.io/api/v1';
const BACKEND_HOST = 'https://testapi.platwin.io/api/v1'

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
  contract: string // contract address
  erc: string // 1155 or 721
  token_id: string //
  amount: string //
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
