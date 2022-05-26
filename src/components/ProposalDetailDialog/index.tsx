import React, { useMemo, useState, useEffect } from 'react'
import './index.less'
import { ICollectionItem, IProposalItem } from '@/utils/apis'
import { Button, Modal, Radio, Space, message, Tooltip } from 'antd'
import { formatDateTime } from '@/utils/utils'
import IconClose from '../../assets/images/icon-close.png'
import ProposalStatus from '../ProposalItemStatus'
import ProposalResults from '../ProposalResults'
import { ProposalStatusEnum, voteProposal, getUserVoteInfo } from '@/utils/apis'
import { MessageTypes, sendMessage } from '@/utils/messageHandler'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import web3 from 'web3'

interface IProps {
  show: boolean
  detail: IProposalItem
  collection: ICollectionItem
  onClose: (updatedProposalId?: string) => void
  account: string
  inDao: boolean
}

export default (props: IProps) => {
  const { show, detail, onClose, collection, account, inDao } = props
  const [vote, setVote] = useState<string>()
  const [submitting, setSubmitting] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [voted, setVoted] = useState(false)
  const totalSupporters = useMemo(() => {
    const totalVotersNum = detail.results.reduce((a, b) => a + b)
    if (totalVotersNum >= detail.ballot_threshold) {
      return totalVotersNum
    } else {
      return `${totalVotersNum}/${detail.ballot_threshold}`
    }
  }, [detail])

  const handleVoteChange = (e: any) => {
    setVote(e.target.value)
  }

  const handleVoteSubmit = async () => {
    if (!vote) {
      message.warn('Please set one option to vote.')
      return
    }
    if (!account) {
      message.warn('No metamask installed.')
      return
    }
    try {
      setSubmitting(true)
      const str = web3.utils.soliditySha3(detail.id, vote)
      const msg = {
        type: MessageTypes.Sing_Message,
        request: {
          message: str,
          account
        }
      }
      const res: any = await sendMessage(msg)
      const params = {
        voter: account,
        collection_id: collection!.id,
        proposal_id: detail.id,
        item: vote,
        sig: res.result
      }
      const result = await voteProposal(params)
      if (result) {
        message.success('Vote successfully.')
        setSubmitting(false)
        onClose(String(detail.id))
      } else {
        message.error('Vote failed.')
        setSubmitting(false)
      }
    } catch (e) {
      setSubmitting(false)
      console.log(e)
      message.warn('Vote failed.')
    }
  }

  useEffect(() => {
    ;(async () => {
      if (show && detail) {
        const params = {
          proposal_id: detail.id,
          collection_id: collection.id,
          addr: account
        }
        const res = await getUserVoteInfo(params)
        if (res) {
          setVoted(true)
          setVote(res.item)
        }
        //get current block height
        const msg = {
          type: MessageTypes.InvokeWeb3Api,
          request: {
            module: 'eth',
            method: 'getBlockNumber'
          }
        }
        const blockRes: any = await sendMessage(msg)
        const { result: currentBlockHeight } = blockRes
        console.log('currentBlockHeight: ', currentBlockHeight)
        if (
          detail.status === ProposalStatusEnum.OPEN &&
          detail.snapshot_block <= currentBlockHeight
        ) {
          setIsOpen(true)
        } else {
          setIsOpen(false)
        }
      }
    })()
  }, [show])

  return (
    <Modal
      footer={null}
      className="common-modal"
      visible={show}
      closable={false}
      width={720}
      mask={false}
      transitionName=""
      maskTransitionName="">
      <div className="proposal-detail-container">
        <div className="header">
          <div className="header-left">
            <p className="end-time">End at {formatDateTime(detail.end_time)}</p>
            <p className="title">{detail.title}</p>
            <p className="total-supporter">Votes - {totalSupporters}</p>
          </div>
          <div className="header-right">
            <img src={IconClose} alt="" onClick={() => onClose()} />
            <ProposalStatus status={detail.status} />
          </div>
        </div>

        <div className="divide-line"></div>
        <div className="desc">
          <p>{detail.description}</p>
        </div>
        <div className="vote-submit-results-container">
          {isOpen && inDao && (
            <div className="vote-container">
              <p className="vote-title">Cast your vote</p>
              <Radio.Group
                onChange={handleVoteChange}
                value={vote}
                className="custom-radio">
                <Space direction="vertical">
                  {detail.items.map((option, index) => (
                    <Radio
                      value={option}
                      key={index}
                      disabled={voted && vote !== option}
                      className="custom-radio-item">
                      {option}
                    </Radio>
                  ))}
                </Space>
              </Radio.Group>
              {!voted && (
                <div>
                  <Button
                    type="primary"
                    onClick={handleVoteSubmit}
                    className="vote-btn"
                    loading={submitting}>
                    Vote now
                  </Button>
                  <Tooltip title="Your vote can not be changed.">
                    <ExclamationCircleOutlined />
                  </Tooltip>
                </div>
              )}
            </div>
          )}
          <ProposalResults items={detail.items} results={detail.results} />
        </div>
      </div>
    </Modal>
  )
}
