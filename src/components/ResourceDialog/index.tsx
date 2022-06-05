import React, { useEffect, useState, useRef, useCallback } from 'react'
import './index.less'
import { ShadowView } from 'shadow-view'
import * as Messages from '../../utils/message'
import { Dialog } from '@material-ui/core'
import { Button, Tabs } from 'antd'
import { MessageTypes, sendMessage } from '../../utils/messageHandler'
import * as PubSub from 'pubsub-js'

import FavNFTList from './FavNFTList'
import OwnedNFTList from './OwnedNFTList'
import UploadNFT from './UploadNFT'
import { isMainNet } from '@/utils/utils'
const { TabPane } = Tabs
interface IProps {
  onClose?: () => void
  publishFunc: () => void | Promise<void>
}
function ResourceDialog(props: IProps) {
  const { onClose, publishFunc } = props
  const [show, setShow] = useState(false)
  const [account, setAccount] = useState('')
  const [tab, setTab] = useState('1')
  const [isCurrentMainnet, setIsCurrentMainNet] = useState(false)

  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    PubSub.subscribe(Messages.PLAT_TWIN_OPEN, (msg, data) => {
      console.log(msg, data)
      setShow(true)
    })
  }, [])

  useEffect(() => {
    if (show) {
      ref.current?.click()
      console.log('document hasFocus: ', document.hasFocus())
    }
  }, [account, show])

  useEffect(() => {
    ;(async () => {
      const req = {
        type: MessageTypes.Connect_Metamask
      }
      const resp: any = await sendMessage(req)
      console.log('get account: ', resp)
      const { account } = resp.result
      setAccount(account)
      const isMain = await isMainNet()
      setIsCurrentMainNet(isMain)
    })()
  }, [])

  const afterFavHandleFinish = () => {
    setShow(false)
    publishFunc && publishFunc()
  }

  return (
    <ShadowView styleContent={''} styleSheets={['style.css']}>
      <Dialog
        open={show}
        onClose={() => {
          onClose?.()
        }}>
        <div className="resource-dialog-container" ref={ref}>
          <Button onClick={() => setShow(false)} className="btn-close">
            Close
          </Button>

          <Tabs
            animated={false}
            defaultActiveKey="1"
            onChange={(key) => {
              setTab(key)
            }}>
            <TabPane tab="My Favorite" key="1" className="fav-list" />
            {!isCurrentMainnet && <TabPane tab="Mint" key="2" />}
            <TabPane tab="NFT Portfolio" key="3" className="fav-list" />
          </Tabs>
          <div className="tab-content">
            {tab === '1' && (
              <FavNFTList
                isCurrentMainnet={isCurrentMainnet}
                account={account}
                publishFunc={afterFavHandleFinish}
              />
            )}
            {tab === '2' && (
              <UploadNFT account={account} publishFunc={afterFavHandleFinish} />
            )}
            {tab === '3' && (
              <OwnedNFTList
                isCurrentMainnet={isCurrentMainnet}
                account={account}
                publishFunc={afterFavHandleFinish}
              />
            )}
          </div>
        </div>
      </Dialog>
    </ShadowView>
  )
}

export default ResourceDialog