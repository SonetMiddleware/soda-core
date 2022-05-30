import * as Api from './service/apis'

export const BINDING_CONTENT_TITLE = 'Binding with Soda'

export const bind = async () => {}

export const bind1WithWeb3Proof = async (params: {
  address: string
  application: string
  appid: string
  sig: string
}) => {
  const { address, application, appid, sig } = params
  return Api.bind1WithWeb3Proof({
    addr: address,
    platform: application,
    tid: appid,
    sig
  })
}
export const bind2WithWeb2Proof = async (params: {
  address: string
  application: string
  appid: string
  contentId: string
}) => {
  const { address, application, appid, contentId } = params
  return Api.bind2WithWeb2Proof({
    addr: address,
    platform: application,
    tid: appid,
    content_id: contentId
  })
}
export const matchBindingPattern = (text: string): boolean => {
  return text.indexOf(BINDING_CONTENT_TITLE) > -1
}
export const unbind = async (params: {
  address: string
  application: string
  appid: string
  sig: string
}) => {
  const { address, application, appid, sig } = params
  return Api.unbind({
    addr: address,
    platform: application,
    tid: appid,
    sig
  })
}

export interface BindInfo {
  address: string
  application: string
  appid: string
  contentId?: string
}
export const getBindResult = async (params: {
  address?: string
  application?: string
  appid?: string
}): Promise<BindInfo[]> => {
  const { address, application, appid } = params
  const res = []
  // FIXME: add application query
  const bindRes = await Api.getBindResult({
    addr: address,
    tid: appid
  })
  for (const b of bindRes) {
    res.push({
      address: b.addr,
      application: b.platform,
      appid: b.tid,
      contentId: b.content_id
    })
  }
  return res
}

export const genReferralCode = async (params: {
  address: string
  application: string
  appid: string
}): Promise<string> => {
  const { address, application, appid } = params
  return Api.genReferralCode({
    addr: address,
    platform: application,
    tid: appid
  })
}
export const acceptReferralCode = async (params: {
  address: string
  referral: string
  sig: string
}): Promise<boolean> => {
  const { address, referral, sig } = params
  return Api.acceptReferralCode({
    addr: address,
    referral: referral,
    sig
  })
}
export const getAcceptedReferralCode = async (
  addr: string
): Promise<string> => {
  return Api.getAcceptedReferralCode(addr)
}
export const getAcceptedCount = async (code: string): Promise<number> => {
  return Api.getAcceptedCount(code)
}
export const getReferralCode = async (params: {
  address: string
  application: string
  appid: string
}): Promise<string> => {
  const { address, application, appid } = params
  return Api.getReferralCode({
    addr: address,
    platform: application,
    tid: appid
  })
}
