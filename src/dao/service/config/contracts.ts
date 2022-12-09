const TestnetContracts = {
  DAORegistry: '0x9a7e176576abb82496e6b3791E15Bea08ecc723e'
}
const RinkebyContracts = {
  DAORegistry: '0x6CEc4160f0Bf0Be55b9AB4Ba48fe019019Df9C48'
}
const PolygonMainnetContracts = {
  DAORegistry: '0x6CEc4160f0Bf0Be55b9AB4Ba48fe019019Df9C48'
}
const EthMainnetContracts = {
  DAORegistry: '0x1443D92E71eFADE956Aa0198F7EC5eeb6d5f2E0F'
}
type ContractConfigs = {
  [key: string]: Record<number | string, string>
}
const configs: ContractConfigs = {
  DaoRegistery: {
    80001: TestnetContracts.DAORegistry,
    137: PolygonMainnetContracts.DAORegistry,
    4: RinkebyContracts.DAORegistry,
    1: EthMainnetContracts.DAORegistry,
    flowmain: EthMainnetContracts.DAORegistry,
    flowtest: EthMainnetContracts.DAORegistry
  }
}
export default configs
