import { ProposalStatusEnum, ProposalVoteEnum } from './const'
import * as Api from './service/apis'

export interface Proposal {
  id: string
  title: string
  description: string
  startTime: number
  snapshotBlock: number
  endTime: number
  ballotThreshold: number
  status: ProposalStatusEnum
  items: string[]
  results: number[]
  voteType: ProposalVoteEnum
}

export const createProposal = async (params: {
  creator: string
  snapshotBlock: number
  daoId: string
  title: string
  description: string
  startTime: number
  endTime: number
  ballotThreshold: number
  items: string[]
  voterType: number
  sig: string
}) => {
  const {
    creator,
    snapshotBlock,
    daoId,
    title,
    description,
    startTime,
    endTime,
    ballotThreshold,
    items,
    voterType,
    sig
  } = params
  return await Api.createProposal({
    creator,
    snapshot_block: snapshotBlock,
    collection_id: daoId,
    title,
    description,
    start_time: startTime,
    end_time: endTime,
    ballot_threshold: ballotThreshold,
    items,
    voter_type: voterType,
    sig
  })
}
export const getProposalList = async (params: {
  dao: string
  page?: number
  gap?: number
}): Promise<{ total: number; data: Proposal[] }> => {
  const proposals = await Api.getProposalList(params)
  const res = { total: proposals.total, data: [] }
  for (const p of proposals.data) {
    res.data.push({
      id: p.id,
      title: p.title,
      description: p.description,
      startTime: p.start_time,
      snapshotBlock: p.snapshot_block,
      endTime: p.end_time,
      ballotThreshold: p.ballot_threshold,
      status: p.status,
      items: p.items,
      results: p.results,
      voteType: p.voter_type
    })
  }
  return res
}
export const getProposalDetail = async () => {}

export const getProposalPermission = async (dao: string, address: string) => {
  const res = await Api.getProposalPermission(dao, address)
  return res
}

export const getVotePermission = async (params: {
  voter_type: number
  collection_id: string | number
  voter: string
  proposal_id: string
}) => {
  return Api.getVotePermission(params)
}

export const vote = async (params: {
  voter: string
  collectionId: string
  proposalId: string
  item: string
  sig: string
}) => {
  const { voter, collectionId, proposalId, item, sig } = params
  return await Api.vote({
    voter,
    collection_id: collectionId,
    proposal_id: proposalId,
    item,
    sig
  })
}
export const getUserVoteInfo = async (params: {
  proposalId: string
  daoId: string
  address: string
}): Promise<{
  daoId: string
  id: string
  voter: string
  item: string
  votes: string
} | null> => {
  const { proposalId, daoId, address } = params
  const res = await Api.getUserVoteInfo({
    proposal_id: proposalId,
    collection_id: daoId,
    addr: address
  })
  return res
    ? {
        daoId: res.collection_id,
        id: res.id,
        voter: res.voter,
        item: res.item,
        votes: res.votes
      }
    : null
}
