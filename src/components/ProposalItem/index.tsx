import React, { useMemo } from 'react'
import './index.less'
import { IProposalItem, ProposalStatusEnum } from '@/utils/apis'
import ProposalItemStatus from '../ProposalItemStatus'
import ProposalResults from '../ProposalResults'
import { formatDate } from '../../utils/utils'
interface IProps {
  item: IProposalItem
  onSelect?: (item: IProposalItem) => void
}

export default (props: IProps) => {
  const { item, onSelect } = props

  const handleSelect = () => {
    onSelect?.(item)
  }

  return (
    <div className="proposal-item-container">
      <div className="proposal-left">
        <p className="proposal-title" onClick={handleSelect}>
          {item.title}
        </p>
        <p className="proposal-desc">{item.description}</p>
        <div className="proposal-item-footer">
          <ProposalItemStatus status={item.status} />
          <p className="start-date-time">
            #{item.snapshot_block} (app. {formatDate(item.start_time)}) ~
            {formatDate(item.end_time)}
          </p>
        </div>
      </div>
      <ProposalResults items={item.items} results={item.results} />
    </div>
  )
}
