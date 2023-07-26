import { createCipheriv, createDecipheriv, randomBytes } from 'crypto'
import config from '@/config'

const algorithm = 'aes-256-ctr'
const secretKey = config.secretKey

// 加密
export function encrypt(text: string) {
  const iv = randomBytes(16)
  const cipher = createCipheriv(algorithm, secretKey, iv)
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()])
  return {
    iv: iv.toString('hex'),
    hash: encrypted.toString('hex')
  }
}
// 解密
export function decrypt(iv: string, hash: string) {
  const decipher = createDecipheriv(
    algorithm,
    secretKey,
    Buffer.from(iv, 'hex')
  )
  const decrpyted = Buffer.concat([
    decipher.update(Buffer.from(hash, 'hex')),
    decipher.final()
  ])
  return decrpyted.toString()
}
