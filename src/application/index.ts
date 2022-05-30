const _apps = {}

export const AppFunction = {
  getAccount: 'getAccount',
  getUserPage: 'getUserPage',
  getConfig: 'getConfig'
}

export const getApplications = (apps?: string[]) => {
  if (!apps || apps.length === 0) return _apps
  const ret = {}
  for (const key of apps) {
    ret[key] = _apps[key] || null
  }
  return ret
}

export const getApplication = (app: string) => {
  return _apps[app]
}

export type AppType = {
  name: string
  meta: any
}

export const registerApplication = (app: AppType) => {
  console.debug('[core-application] registerApplication: ', app)
  _apps[app.name] = app.meta
}

export const appInvoke = async (app: string, func: string, meta?: any) => {
  if (!_apps[app]) {
    throw new Error('Application not found.')
  }
  if (!_apps[app][func]) {
    throw new Error('Function not found.')
  }
  try {
    const res = await _apps[app][func](meta)
    return res
  } catch (e) {
    throw e
  }
}
