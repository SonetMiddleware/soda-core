import React, { useEffect, useState } from 'react'
import { Modal, Button } from 'antd'
import * as ReactDOM from 'react-dom'
import './index.less'
import { getProposalList, ICollectionItem, IProposalItem } from '@/utils/apis'
import { formatDate } from '@/utils/utils'
import ProposalItem from '../ProposalItem'
import { MessageTypes, sendMessage } from '@/utils/messageHandler'
interface IProps {
  show: boolean
  onClose: () => void
  collection: ICollectionItem
}

export default (props: IProps) => {
  const { show, onClose, collection } = props
  const { dao: currentDao } = collection || {}
  const [list, setList] = useState<IProposalItem[]>([])

  let divNode: HTMLDivElement = null
  divNode = document.createElement('div')
  document.body.append(divNode)

  const fetchProposalList = async (daoId: string) => {
    const listResp = await getProposalList({ dao: daoId })
    const list = listResp.data
    setList(list)
  }

  useEffect(() => {
    if (collection && collection.id) {
      fetchProposalList(collection.id)
    }
  }, [collection])

  const handleNew = () => {
    const uri = `daoDetail?dao=${collection.id}`
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
      className="proposal-modal">
      <div className="proposal-container">
        <div className="header">
          <p className="title">Proposal</p>
          <Button
            type="default"
            className="btn-new-proposal"
            onClick={handleNew}>
            New Proposal
          </Button>
        </div>
        <div className="proposal-modal-content">
          <div className="left-content">
            <div className="dao-img">
              <img src={currentDao?.img} alt="" />
              <p className="dao-name">{currentDao?.name}</p>
            </div>
            <div className="dao-detail-info">
              <p className="dao-info-item">
                <span className="label">Start date</span>
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
                <ProposalItem item={item} onSelect={() => {}} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Modal>,
    divNode
  )
}
