import core from '../share/core'

function type() {
  return core.isPsa() ? 'psa' : 'pta'
}

export default {
  cc: `cxscc/s/${type()}/`,
  crm: `cxscrm/s/${type()}/`,
  crmes: `cxscrmes/s/${type()}/`,
  crmrr: `cxscrmrr/s/${type()}/`,
  crmmu: `cxscrmmu/s/${type()}/`,
  crmmurr: `cxscrmmurr/s/${type()}/`,
  cs: `cxscs/s/${type()}/`,
  cs_noauth: 'cxscs/s/noauth/',
  dm: `cxsdm/s/${type()}/`,
  fs: `cxsfs/s/${type()}/`,
  lizhai: `cxslizhai/s/${type()}/`,
  lms: `cxslms/s/${type()}/`,
  log: `cxslog/s/${type()}/`,
  rpt: `cxsrpt/s/${type()}/`,
  sms: `cxssms/s/${type()}/`,
  tsk: `cxstsk/s/${type()}/`,
  tst: `cxstst/s/${type()}/`,
  wht: `cxswht/s/${type()}/`
}
