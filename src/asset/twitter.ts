import * as Api from './service/twitter-apis'

export const getNFTRelatedTwitterData = async (params: {
  chainName?: string
  chainId?: number
  contract: string
  tokenId: number
}): Promise<{
  retweetCount: number
  replyCount: number
  likeCount: number
  quoteCount: number
}> => {
  const { chainName: chain_name, chainId, contract, tokenId: token_id } = params
  const res = await Api.getNFTRelatedTwitterData({
    chain_name,
    chainId,
    contract,
    token_id
  })
  const {
    retweet_count: retweetCount,
    reply_count: replyCount,
    like_count: likeCount,
    quote_count: quoteCount
  } = res
  return { retweetCount, replyCount, likeCount, quoteCount }
}

export const getTwitterDailyData = async (params: {
  chainName?: string
  chainId?: number
  contract: string
  tokenId: number
  start: string
  count?: number
}): Promise<{
  start: string
  data: {
    snapshotTime: string
    retweetCount: number
    replyCount: number
    likeCount: number
    quoteCount: number
  }[]
}> => {
  const {
    chainName: chain_name,
    chainId,
    contract,
    tokenId: token_id,
    start,
    count
  } = params
  const d = await Api.getTwitterDailyData({
    chain_name,
    chainId,
    contract,
    token_id,
    start,
    count
  })
  const res = { start: d.start, data: [] }
  for (const i of d.data) {
    const {
      snapshot_time: snapshotTime,
      retweet_count: retweetCount,
      reply_count: replyCount,
      like_count: likeCount,
      quote_count: quoteCount
    } = i
    res.data.push({
      snapshotTime,
      retweetCount,
      replyCount,
      likeCount,
      quoteCount
    })
  }
  return res
}

export interface TwitterInfo {
  tid: string
  userImg: string
  userId: string
  username: string
  content: string
}
export const traceTwitterForNFT = async (params: {
  chainId?: number
  chainName?: string
  contract: string
  tokenId: string
  info: TwitterInfo
}) => {
  const {
    chainId,
    chainName: chain_name,
    contract,
    tokenId: token_id,
    info
  } = params
  const {
    tid,
    userImg: user_img,
    userId: user_id,
    username: user_name,
    content: t_content
  } = info
  const res = await Api.traceTwitterForNFT({
    chainId,
    chain_name,
    contract,
    token_id,
    tid,
    user_img,
    user_id,
    user_name,
    t_content
  })
  return res.data
}

export const getNFTRelatedTweet = async (params: {
  chainName?: string
  chainId?: number
  contract: string
  tokenId: number
}): Promise<
  {
    chainName: string
    contract: string
    tokenId: string
    info: TwitterInfo
  }[]
> => {
  const { chainName: chain_name, chainId, contract, tokenId: token_id } = params
  const tweets = await Api.getNFTRelatedTweet({
    chain_name,
    chainId,
    contract,
    token_id
  })
  const res = []
  for (const t of tweets) {
    const {
      chain_name: chainName,
      contract,
      token_id: tokenId,
      tid,
      user_img,
      user_id,
      user_name,
      t_content
    } = t
    res.push({
      chainName,
      contract,
      tokenId,
      info: {
        tid,
        userImg: user_img,
        userId: user_id,
        username: user_name,
        content: t_content
      }
    })
  }
  return res
}
