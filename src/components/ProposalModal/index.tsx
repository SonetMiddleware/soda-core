import React, { useEffect, useState } from 'react'
import { Modal, Button } from 'antd'
import * as ReactDOM from 'react-dom'
import './index.less'
import { getProposalList, ICollectionItem, IProposalItem } from '@/utils/apis'
import { formatDate } from '@/utils/utils'
import ProposalItem from '../ProposalItem'
import {
  MessageTypes,
  sendMessage,
  getUserAccount
} from '@/utils/messageHandler'
import ProposalDetailDialog from '../ProposalDetailDialog'
import CommonBtn from '../Button'
interface IProps {
  show: boolean
  onClose: () => void
  collection: ICollectionItem
}

export default (props: IProps) => {
  const { show, onClose, collection } = props
  const { dao: currentDao } = collection || {}
  const [list, setList] = useState<IProposalItem[]>([])
  const [showModal, setShowModal] = useState(false)
  const [account, setAccount] = useState('')
  const [inDao, setInDao] = useState(false)
  const [selectedProposal, setSelectedProposal] = useState<IProposalItem>()
  let divNode: HTMLDivElement = null
  divNode = document.createElement('div')
  document.body.append(divNode)

  const fetchProposalList = async (daoId: string) => {
    const listResp = await getProposalList({ dao: daoId })
    const list = listResp.data
    setList(list)
  }
  const handleDetailDialogClose = () => {
    setShowModal(false)
    fetchProposalList(collection.id)
  }

  const fetchUserInfo = async () => {
    const addr = await getUserAccount()
    setAccount(addr)
    // get user nft balance
    const msg = {
      type: MessageTypes.InvokeERC721Contract,
      request: {
        contract: collection.id,
        method: 'balanceOf',
        readOnly: true,
        args: [addr]
      }
    }
    const balanceRes: any = await sendMessage(msg)
    console.log('GetNFTBalance: ', balanceRes)
    const balance = balanceRes.result
    if (Number(balance) > 0) {
      setInDao(true)
    }
  }

  useEffect(() => {
    if (show && collection && collection.id) {
      fetchProposalList(collection.id)
      fetchUserInfo()
    }
  }, [collection, show])

  const handleNew = () => {
    const uri = `daoNewProposal?dao=${collection.id}`
    const req = {
      type: MessageTypes.Open_OptionPage,
      request: {
        uri
      }
    }
    sendMessage(req)
  }

  return ReactDOM.createPortal(
    <Modal
      visible={show}
      footer={null}
      onCancel={onClose}
      width={944}
      transitionName=""
      maskTransitionName=""
      className="proposal-modal">
      <div className="proposal-container">
        <div className="header">
          <p className="title">Proposal</p>
          <CommonBtn
            type="primary"
            className="btn-new-proposal"
            disabled={!inDao}
            onClick={handleNew}>
            New Proposal
          </CommonBtn>
        </div>
        <div className="proposal-modal-content">
          <div className="left-content">
            <div className="dao-img">
              <img src={collection?.img} alt="" />
              <p className="dao-name">{currentDao?.name}</p>
            </div>
            <div className="dao-detail-info">
              <p className="dao-info-item">
                <span className="label">Create date</span>
                <span className="value">
                  {formatDate(currentDao?.start_date)}
                </span>
              </p>
              <p className="dao-info-item">
                <span className="label">Total members</span>
                <span className="value">{currentDao?.total_member}</span>
              </p>
              <p className="dao-info-item">
                <span className="label">Twitter account</span>
                <span className="value">{currentDao?.twitter}</span>
              </p>
              <p className="dao-info-item">
                <span className="label">Facebook account</span>
                <span className="value">{currentDao?.facebook}</span>
              </p>
            </div>
          </div>
          <div className="proposal-list-container">
            <div className="proposal-list">
              {list.map((item) => (
                <ProposalItem
                  item={item}
                  onSelect={() => {
                    setShowModal(true)
                    setSelectedProposal(item)
                  }}
                />
              ))}
            </div>
          </div>
          {selectedProposal && (
            <ProposalDetailDialog
              collection={collection}
              show={showModal}
              detail={selectedProposal!}
              onClose={handleDetailDialogClose}
              account={account}
              inDao={inDao}
            />
          )}
        </div>
      </div>
    </Modal>,
    divNode
  )
}
