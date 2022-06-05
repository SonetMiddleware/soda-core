import {
  createWeb3,
  registerMessage,
  sendMessage,
  isMetamaskConnected
} from '@soda/soda-util'

export const requestSignMsg = async (msg: string, address: string) => {
  const web3 = createWeb3()
  try {
    const signParams = [msg, address]
    const method = 'personal_sign'
    const res = await web3.eth.personal.sign(msg, address, '')
    console.debug('[core] requestSignMsg: ', msg, address, res)
    return res
  } catch (err) {
    console.error(err)
    return
  }
}

// message to background
const MessageTypes = {
  Sign_Message: 'Sign_Message'
}

export const sign = async (request: { message: string; address: string }) => {
  const response: any = {}
  try {
    const res: any = await sendMessage({
      type: MessageTypes.Sign_Message,
      request
    })
    return res
  } catch (e) {
    console.error(e)
    response.error = (e as any).message || e
  }
  return response
}

async function signMessageHandler(request: any) {
  const response: any = {}
  if (!isMetamaskConnected()) {
    response.error = 'Metamask not connected'
    return JSON.stringify(response)
  }
  try {
    const { message, address } = request
    const res = await requestSignMsg(message, address)
    response.result = res
  } catch (e) {
    console.error(e)
    response.error = (e as any).message || e
  }
  return response
}

export const bgInit = () => {
  registerMessage({
    message: MessageTypes.Sign_Message,
    handleFunc: signMessageHandler
  })
}
