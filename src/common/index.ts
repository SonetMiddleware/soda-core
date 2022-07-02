import web3 from 'web3'
import { Mixed } from 'web3-utils'

export const sha3 = (...val: Mixed[]): string | null => {
  return web3.utils.soliditySha3(...val)
}

import moment from 'moment'

export const formatDate = (datetime?: number) => {
  return datetime ? moment(datetime).format('DD/MM/YYYY') : ''
}

export const formatDateTime = (datetime: number) => {
  return moment(datetime).format('YYYY-MM-DD HH:mm:ss')
}

export const SUCCESS_CODE = 0
