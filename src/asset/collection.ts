import { NFT } from '@soda/soda-asset'
import { DaoItem, toDaoItem } from '../dao/dao'
import { toToken } from './assetList'
import * as Api from './service/apis'

export const createCollection = async () => {}
export const udpateCollection = async () => {}

export const getCollectionList = async (params: {
  address: string
  page?: number
  gap?: number
}): Promise<{ total: number; data: CollectionItem[] }> => {
  const { address, page, gap } = params
  const collections = await Api.getCollectionList({
    addr: address,
    page,
    gap
  })
  const res = { total: collections.total, data: [] }
  for (const c of collections.data) {
    const d = c.dao
    res.data.push({
      id: c.id,
      name: c.name,
      image: c.img,
      dao: toDaoItem(c.dao)
    })
  }
  return res
}
export interface CollectionItem {
  id: string
  name: string
  image: string
  dao: DaoItem
}
export const getCollectionByToken = async (
  token: NFT
): Promise<CollectionItem | null> => {
  return getCollectionById(token.contract)
}
export const getCollectionById = async (
  daoId: string
): Promise<CollectionItem | null> => {
  // TODO add chain id and contract
  const item = await Api.getCollectionById(daoId)
  const dao = item.dao
  return {
    id: item.id,
    name: item.name,
    image: item.img,
    dao: toDaoItem(item.dao)
  }
}
export const getCollectionTokenList = async (params: {
  collectionId: string
  address?: string
  page?: number
  gap?: number
}): Promise<{
  total: number
  collectionId: string
  name: string
  image: string
  data: NFT[]
}> => {
  const { collectionId, address, page, gap } = params
  const nfts = await Api.getCollectionNFTList({
    collection_id: collectionId,
    addr: address,
    page,
    gap
  })
  const res = {
    total: nfts.total,
    collectionId: nfts.collection_id,
    name: nfts.collection_name,
    image: nfts.collection_img,
    data: []
  }
  for (const t of nfts.data) {
    res.data.push(toToken(t))
  }
  return res
}
