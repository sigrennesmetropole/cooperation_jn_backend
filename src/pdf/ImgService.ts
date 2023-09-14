import fs from 'fs'
import path from 'path'

export function getImg(imgName: string) {
  const imgPath = path.resolve(__dirname, 'assets', imgName)
  const imgBase64 = fs.readFileSync(imgPath).toString('base64')
  return imgBase64
}
