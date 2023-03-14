import base from './base'

export default {
  // 拼接录音文件地址
  makeUpRecordUrl(row: { recordPath?: string; recordFile?: string }) {
    const { recordPath, recordFile } = row
    if (recordPath && recordFile) {
      return base.getLocationPath() + recordPath + recordFile
    }
  }
}
