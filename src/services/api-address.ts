import axios, { type Method } from 'axios'

//Documention of API : https://adresse.data.gouv.fr/api-doc/adresse

export async function getAddressReverse (lat: string, lon: string) {
    const baseUrl = 'https://api-adresse.data.gouv.fr/reverse/'
    const url = baseUrl + `?lon=${lon}&lat=${lat}`

  const config = {
    method: 'get' as Method,
    url,
    timeout: 20000 // 20 secondes
  }

  try {
    const response = await axios(config)
    if (response.data &&
      response.data.features.length > 0 &&
      response.data.features[0].properties &&
      response.data.features[0].properties.label
    ) {
      return response.data.features[0].properties.label
    } else {
      throw new Error('Empty address')
    }
  } catch (error) {
    // @ts-ignore
    throw new Error('Error get address revert: ' + error.message)
  }
}
