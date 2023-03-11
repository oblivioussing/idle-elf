import { createLogger, format, transports } from 'winston'
import 'winston-daily-rotate-file'

const options = {
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d'
}
const timestamp = format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' })
const printf = format.printf((info) => {
  return `${info.level}: ${info.timestamp}:${info.message}`
})

const errorLogger = createLogger({
  level: 'error',
  transports: [
    new transports.DailyRotateFile({
      format: format.combine(timestamp, printf),
      filename: 'logs/error/%DATE%.log',
      ...options
    })
  ]
})

export default {
  error(content: string) {
    errorLogger.error(content)
  }
}
