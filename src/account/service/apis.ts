import { httpRequest, HttpRequestType } from '@soda/soda-util'

const BACKEND_HOST = process.env.API_HOST

const SUCCESS_CODE = 0

export interface IBind1Params {
  addr: string
  tid: string
  sig: string
  platform: string
}
export const bind1WithWeb3Proof = async (params: IBind1Params) => {
  const url = `${BACKEND_HOST}/bind-addr`
  const res = await httpRequest({ url, params, type: HttpRequestType.POST })
  console.debug('[core-account] bind1WithWeb3Proof: ', params, res)
  if (res.error) return false
  return true
}

export interface IBind2Params {
  addr: string
  tid: string
  platform: string
  content_id: string
}
export const bind2WithWeb2Proof = async (params: IBind2Params) => {
  const url = `${BACKEND_HOST}/bind-addr/record`
  const res = await httpRequest({ url, params, type: HttpRequestType.POST })
  console.debug('[core-account] bind2WithWeb2Proof: ', params, res)
  if (res.error) return false
  return true
}

export interface IUnbindParams {
  addr: string
  tid: string
  platform: string
  sig: string
}
export const unbind = async (params: IUnbindParams) => {
  const url = `${BACKEND_HOST}/unbind-addr`
  const res = await httpRequest({ url, params, type: HttpRequestType.POST })
  console.debug('[core-account] unbindAddr: ', params, res)
  if (res.error) return false
  return true
}

export interface IPlatformAccount {
  platform: string
  account: string
}
export interface IGetBindResultParams {
  addr?: string
  tid?: string
}
export interface IBindResultData {
  addr: string
  tid: string
  platform: string
  content_id?: string
}
export const getBindResult = async (
  params: IGetBindResultParams
): Promise<IBindResultData[]> => {
  const url = `${BACKEND_HOST}/bind-attr`
  if (!params.addr) {
    return []
  }
  try {
    const res = await httpRequest({ url, params })
    console.debug('[core-account] getBindResult: ', params, res)
    if (res.error) return []
    return res.data as IBindResultData[]
  } catch (e) {
    console.error(e)
    return []
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
    const res = await httpRequest({ url, params, type: HttpRequestType.POST })
    console.debug('[core-account] genReferralCode: ', params, res)
    if (res.error) return ''
    return res.data
  } catch (e) {
    console.error(e)
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
  const res = await httpRequest({ url, params, type: HttpRequestType.POST })
  console.debug('[core-account] acceptReferralCode: ', params, res)
  if (res.error || res.code !== SUCCESS_CODE) {
    return false
  } else {
    return true
  }
}

export const getAcceptedReferralCode = async (
  addr: string
): Promise<string> => {
  const url = `${BACKEND_HOST}/referral/code`
  const params = { addr }
  const res = await httpRequest({ url, params })
  console.debug('[core-account] getAcceptedReferralCode: ', params, res)
  if (res.error) return ''
  return res.data
}

export const getAcceptedCount = async (code: string): Promise<number> => {
  const url = `${BACKEND_HOST}/referral/count`
  const params = { code }
  const res = await httpRequest({ url, params })
  console.debug('[core-account] getAcceptedCount: ', params, res)
  if (res.error) return 0
  return res.data
}

export interface IGetReferralCodeParams {
  addr: string
  platform: string
  tid: string
}
export const getReferralCode = async (
  params: IGetReferralCodeParams
): Promise<string> => {
  const url = `${BACKEND_HOST}/referral`
  const res = await httpRequest({ url, params })
  console.debug('[core-account] getReferralCode: ', params, res)
  if (res.error) return ''
  return res.data
}
