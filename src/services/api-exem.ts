import axios, { type Method } from 'axios'

export async function getSiteMeasurement(id: string) {
  const baseUrl = process.env.EXEM_API_URL
  const api_key = process.env.EXEM_API_KEY
  const url = baseUrl + `?api_key=${api_key}`

  const config = {
    method: 'get' as Method,
    url,
    timeout: 20000, // 20 secondes
  }
  try {
    const response = await axios(config)
    const measurement: any = response.data.find(
      (objet: { id: string }) => objet.id === id
    )
    return measurement
  } catch (error: any) {
    throw new Error('Error get site measurement: ' + error.message)
  }
}

export async function getSitesMeasurement() {
  const baseUrl = process.env.EXEM_API_URL
  const api_key = process.env.EXEM_API_KEY
  const url = baseUrl + `?api_key=${api_key}`

  const config = {
    method: 'get' as Method,
    url,
    timeout: 20000, // 20 secondes
  }
  try {
    const response = await axios(config)
    return response.data
  } catch (error: any) {
    throw new Error('Error get sites measurement: ' + error.message)
  }
}

function convertTimeStamp(timestampInSeconds: any) {
  const timestampInMilliseconds = timestampInSeconds * 1000

  const dateObj = new Date(timestampInMilliseconds)

  const day = String(dateObj.getDate()).padStart(2, '0')
  const month = String(dateObj.getMonth() + 1).padStart(2, '0')
  const year = dateObj.getFullYear()

  const hours = String(dateObj.getHours()).padStart(2, '0')
  const minutes = String(dateObj.getMinutes()).padStart(2, '0')

  const newDate = `${day}.${month}.${year} à ${hours}h${minutes}`
  return newDate
}

function getConformity(value: number) {
  if (value <= 6) {
    return 'conform'
  } else if (value > 6 && value < 28) {
    return 'under surveillance'
  } else if (value > 28) {
    return 'non-conforming'
  } else {
    return ''
  }
}

function transformAddress(address: string) {
  const street = address.split(',', 1)[0]
  return street
}

export async function getModifiedSitesMeasurement() {
  try {
    const sitesMeasurement = await getSitesMeasurement()

    const newDateSitesMeasurement = sitesMeasurement.map(
      (object: { lastCom: any }) => {
        return {
          ...object,
          lastCom: convertTimeStamp(object.lastCom),
        }
      }
    )

    const conformitySitesMeasurement = newDateSitesMeasurement.map(
      (object: { latest_value: number }) => {
        const conformity = getConformity(object.latest_value)
        return {
          ...object,
          conformity,
        }
      }
    )

    const finalSitesMeasurement = conformitySitesMeasurement.map(
      (object: { address: string }) => {
        return {
          ...object,
          address: transformAddress(object.address),
        }
      }
    )

    return finalSitesMeasurement
  } catch (error: any) {
    throw new Error('Error get sites measurement: ' + error.message)
  }
}
