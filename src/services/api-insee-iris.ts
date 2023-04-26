import axios, { type Method } from 'axios'

export async function getIrisCode(lat: string, lon: string) {
  const url = 'https://pyris.datajazz.io/api/coords?geojson=false&'
  const config = {
    method: 'get' as Method,
    url,
    params: {
      lat: lat,
      lon: lon
    }
  }
  try {
    const response = await axios(config)
    return response.data.complete_code
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}