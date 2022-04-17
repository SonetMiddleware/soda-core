const _apps = {}

const getApplication = (types?: string[]) => {
  if (!types || types.length === 0) return _apps
  const ret = {}
  for (const key of types) {
    ret[key] = _apps[key] || null
  }
  return ret
}

export type AppType = {
  name: string
  meta: any
}
const registerApplication = (app: AppType) => {
  _apps[app.name] = app.meta
}

export { registerApplication, getApplication }

export default _apps
