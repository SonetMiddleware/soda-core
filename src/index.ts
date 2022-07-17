export * from './common'
export * from './account'
export * from './asset'
export * from './application'
export * from './dao'
export * from './marketplace'
export * from './util'
export * from './asset/service/apis'

import PackageIndexInit from '@soda/soda-package-index'
const init = () => {
  PackageIndexInit()
}
export default init

import { bgInit as packageBgInit } from '@soda/soda-package-index'
import { bgInit as accountBgInit } from './account/service/web3'
import { bgInit as daoBgInit } from './dao/dao'

export const bgInit = () => {
  packageBgInit()
  accountBgInit()
  daoBgInit()
}
