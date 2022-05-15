// message to background
export function randomId() {
  return Math.random().toString(36).substring(2, 10)
}

export const sendMessage = async (message: any) => {
  const id = randomId()
  message.id = id
  const msg = JSON.stringify(message)
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(msg, function (response) {
      console.log('Response from backend：' + response)
      const res = JSON.parse(response)
      if (res.id === id) {
        resolve(res)
      }
    })
  })
}

export const MessageTypes = {
  Connect_Metamask: 'Connect_Metamask',
  Mint_Token: 'Mint_Token',
  Sing_Message: 'Sign_Message',
  Get_Owner: 'Get_Owner',
  Get_Minter: 'Get_Minter',
  Register_DAO: 'Register_DAO',
  Open_OptionPage: 'Open_OptionPage',
  InvokeERC721Contract: 'InvokeERC721Contract',
  InvokeWeb3Api: 'InvokeWeb3Api'
}

export const getOwner = async (tokenId: string) => {
  const req = {
    type: MessageTypes.Get_Owner,
    request: {
      tokenId
    }
  }
  console.log('get owner req: ', req)
  const resp: any = await sendMessage(req)
  console.log('get owner: ', resp)
  const owner = resp.result
  return owner
}

export const getMinter = async (tokenId: string) => {
  const req = {
    type: MessageTypes.Get_Minter,
    request: {
      tokenId
    }
  }
  const resp: any = await sendMessage(req)
  console.log('get minter: ', resp)
  const minter = resp.result
  return minter
}

let accountGlobal = ''
export const getUserAccount = async () => {
  if (!accountGlobal) {
    const req = {
      type: MessageTypes.Connect_Metamask
    }
    const resp: any = await sendMessage(req)
    console.log('get account: ', resp)
    if (resp.error) {
      accountGlobal = ''
    } else {
      const { account } = resp.result
      accountGlobal = account
    }
  }
  return accountGlobal
}
export const getChainId = async () => {
  try {
    const req = {
      type: MessageTypes.Connect_Metamask
    }
    const resp: any = await sendMessage(req)
    console.log('getChainId: ', resp)
    const { chainId } = resp.result
    return chainId
  } catch (err) {
    console.log(err)
  }
}
