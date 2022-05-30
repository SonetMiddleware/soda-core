import { createWeb3, getUserAccount } from '@soda/soda-util'
import Contracts from './config/contracts'
import RegisterDaoAbi from './config/abis/DAORegistry.json'
import { AbiItem } from 'web3-utils'
import { serviceRequestAccounts } from '@soda/soda-util'

export const registerDao = async (params: any) => {
  const { collectionId, name, facebook, twitter } = params
  const web3 = createWeb3()
  const { accounts } = await serviceRequestAccounts()
  const account = accounts[0]
  const CHAIN_ID = await web3.eth.getChainId()
  const daoContract = new web3.eth.Contract(
    RegisterDaoAbi.abi as AbiItem[],
    Contracts.DaoRegistery[CHAIN_ID]
  )
  return new Promise((resolve, reject) => {
    daoContract.methods
      .createDao(collectionId, name, facebook, twitter)
      .send({ from: account })
      .on('receipt', function (receipt: any) {
        resolve(true)
      })
      .on('error', function (error: Error) {
        console.error('[core-dao] registerDao error:', error)
        reject(error)
      })
  })
}
