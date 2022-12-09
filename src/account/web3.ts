import { getChainId as utilGetChainId, getUserAccount } from '@soda/soda-util'
import * as Service from './service/web3'
import { getChains, invokeChainApi } from '@soda/soda-asset'

export const getAddressList = async () => {}

export const getAddress = async (targetChainId?: number) => {
  return await getUserAccount(targetChainId)
}
export const getChainId = async () => {
  return await utilGetChainId()
}
export const sign = async (request: { message: string; address: string }) => {
  return await Service.sign(request)
}

export const createCredential = async () => {}
export const removeCredential = async () => {}
export const updateCredential = async () => {}

export const estimateBlockByTime = async (
  chainId: number,
  timeMilliseconds: number[]
) => {
  const chains = getChains()
  let chain: string = ''
  for (const c of Object.keys(chains)) {
    if (chains[c].chainId == chainId) {
      chain = c
      break
    }
  }
  return invokeChainApi(chain, 'estimateBlockByTime', { timeMilliseconds })
}
