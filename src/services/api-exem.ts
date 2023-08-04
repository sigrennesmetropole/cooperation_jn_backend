import axios, { type Method } from 'axios'

export async function getSiteMeasurement (id: string) {

    const baseUrl = 'https://external-api.exem.fr/sites'
    const api_key = 'EXEM_API_KEY'
    let url = baseUrl + `?api_key=${api_key}`

  const config = {
    method: 'get' as Method,
    url,
    timeout: 20000 // 20 secondes
  }
  try {
    const response = await axios(config)
    const measurement: any = response.data.find((objet: { id: string }) => objet.id === id)
    return measurement
    
  } catch (error) {
    // @ts-ignore
    throw new Error('Error get site measurement: ' + error.message)
  }
}

export async function getSitesMeasurement () {

    const baseUrl = 'https://external-api.exem.fr/sites'
    const api_key = 'EXEM_API_KEY'
    let url = baseUrl + `?api_key=${api_key}`

  const config = {
    method: 'get' as Method,
    url,
    timeout: 20000 // 20 secondes
  }
  try {
    const response = await axios(config)
    return response.data
    
  } catch (error) {
    // @ts-ignore
    throw new Error('Error get sites measurement: ' + error.message)
  }
}
