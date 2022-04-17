const _chains = {}

export type ChainType = {
  name: string
  meta: any
}

const registerChain = (chain: ChainType) => {
  _chains[chain.name] = chain.meta
}

const getChain = (types?: string[]) => {
  if (!types || types.length === 0) return _chains
  const ret = {}
  for (const key of types) {
    ret[key] = _chains[key] || null
  }
  return ret
}

export { registerChain, getChain }
export default _chains
