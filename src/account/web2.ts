import { AppFunction, appInvoke } from '../application'

export const getAccountList = async () => {}
export const getAccountToken = async () => {}
export const createAccount = async () => {}
export const removeAccount = async () => {}
export const updateAccount = async () => {}
export const getWeb2Account = async (app: string) => {
  return await appInvoke(app, AppFunction.getAccount)
}
