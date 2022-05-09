import React, { useMemo } from 'react'
import './index.less'
import { ProposalStatusEnum } from '@/utils/apis'
import classNames from 'classnames'

export default (props: { status: ProposalStatusEnum }) => {
  const { status } = props

  const statusText = useMemo(() => {
    if (status === ProposalStatusEnum.SOON) {
      return 'Soon'
    } else if (status === ProposalStatusEnum.OPEN) {
      return 'Open'
    } else if (status === ProposalStatusEnum.PASSED) {
      return 'Soon'
    } else if (status === ProposalStatusEnum.NOT_PASSED) {
      return 'Soon'
    }
  }, [status])

  return (
    <div
      className={classNames('status', {
        open: status === ProposalStatusEnum.OPEN,
        soon: status === ProposalStatusEnum.SOON,
        passed: status === ProposalStatusEnum.PASSED,
        notPassed: status === ProposalStatusEnum.NOT_PASSED
      })}>
      <span className="dot"></span>
      <span className="text">{statusText}</span>
    </div>
  )
}
