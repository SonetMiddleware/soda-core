import { Collection, Function, invoke, NFT } from '@soda/soda-asset'
import { getAssetServices } from './asset'

export const getCollectionTokenList = async (params: {
  collectionId: string
  address?: string
  offset?: number
  limit?: number
}): Promise<{
  total: number
  collection: Collection
  data: NFT[]
}> => {
  try {
    const { names } = await getAssetServices({})
    if (names.length <= 0)
      throw new Error('No getCollectionTokenList service found.')
    // TODO: choose better mint service for now, first service only
    const tokens = await invoke(
      names[0],
      Function.getCollectionTokenList,
      params
    )
    return tokens
  } catch (e) {
    console.error(e)
    throw new Error('Error on getOwnedTokens ' + e)
  }
}
