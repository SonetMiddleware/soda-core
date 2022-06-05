import { Collection, NFT } from '@soda/soda-asset'
import {
  isMetamaskConnected,
  registerMessage,
  sendMessage
} from '@soda/soda-util'
import * as Api from './service/apis'
import * as Platwin from './service/platwin'

const MessageTypes = {
  Register_DAO: 'Register_DAO'
}

export const registerDao = async (info: {
  collectionId: string
  name: string
  facebook?: string
  twitter?: string
}) => {
  const res: any = await sendMessage({
    type: MessageTypes.Register_DAO,
    request: info
  })
  if (res.error) throw new Error('Error to register DAO: ' + res)
  return res.result
}

async function registerDaoMessageHandler(request: any) {
  const response: any = {}
  if (!isMetamaskConnected()) {
    response.error = 'Metamask not connected'
    return JSON.stringify(response)
  }
  try {
    const res = await Platwin.registerDao(request)
    response.result = res
  } catch (e) {
    console.error(e)
    response.error = (e as any).message || e
  }
  return response
}

export interface CollectionDao {
  collection: Collection
  dao: DaoItem
}
export const getCollectionDaoList = async (params: {
  address: string
  offset?: number
  limit?: number
}): Promise<{ total: number; data: CollectionDao[] }> => {
  const { address, offset, limit } = params
  let page: number
  if (offset && limit && limit > 0) page = Math.floor(offset / limit)
  const collections = await Api.getCollectionList({
    addr: address,
    page,
    gap: limit
  })
  const res = { total: collections.total, data: [] }
  for (const c of collections.data) {
    const dao = c.dao
    // TODO: DAO share the same id with collection
    if (dao) {
      if (!dao.id) dao.id = c.id
      if (!dao.img) dao.img = c.img
      if (!dao.name) dao.name = c.name
    }
    res.data.push({
      collection: {
        id: c.id,
        name: c.name,
        image: c.img
      },
      dao: toDaoItem(dao)
    })
  }
  return res
}
export const getCollectionDaoByToken = async (
  token: NFT
): Promise<CollectionDao | null> => {
  const item = await Api.getCollectionDaoByContract({
    contract: token.contract,
    chainId: token.chainId
  })
  if (!item) return null
  const dao = item.dao
  // TODO: DAO share the same id with collection
  if (dao) {
    if (!dao.id) dao.id = item.id
    if (!dao.img) dao.img = item.img
    if (!dao.name) dao.name = item.name
  }
  return {
    collection: {
      id: item.id,
      name: item.name,
      image: item.img
    },
    dao: toDaoItem(dao)
  }
}

export const getCollectionDaoByCollectionId = async (params: {
  id: string
  chainId?: number
}): Promise<CollectionDao | null> => {
  const item = await Api.getCollectionDaoByCollectionId(params)
  if (!item) return null
  const dao = item.dao
  // TODO: DAO share the same id with collection
  if (dao) {
    if (!dao.id) dao.id = item.id
    if (!dao.img) dao.img = item.img
    if (!dao.name) dao.name = item.name
  }
  return {
    collection: {
      id: item.id,
      name: item.name,
      image: item.img
    },
    dao: toDaoItem(dao)
  }
}

export const bgInit = () => {
  registerMessage({
    message: MessageTypes.Register_DAO,
    handleFunc: registerDaoMessageHandler
  })
}

export interface DaoItem {
  name: string
  startDate: number
  totalMember: number
  accounts: any
  id: string
  image: string
}
export const toDaoItem = (d: Api.IDaoItem): DaoItem => {
  return {
    name: d.name,
    startDate: d.start_date,
    totalMember: d.total_member,
    accounts: {
      facebook: d.facebook,
      twitter: d.twitter
    },
    id: d.id,
    image: d.img
  }
}
export const createDao = async () => {}
export const getDaoList = async (params: {
  address?: string
  offset?: number
  limit?: number
}): Promise<{ total: number; data: DaoItem[] }> => {
  const { address, offset, limit } = params
  let page: number
  if (offset && limit && limit > 0) page = Math.floor(offset / limit)
  const daos = await Api.getDaoList({ addr: address, page, gap: limit })
  const res = { total: daos.total, data: [] }
  for (const d of daos.data) {
    res.data.push(toDaoItem(d))
  }
  return res
}

export const getDaoDetail = async () => {}
export const editDao = async () => {}
