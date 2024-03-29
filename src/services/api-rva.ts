import axios, { type Method } from 'axios'

interface ApiData {
  rva: {
    answer: {
      status: {
        code: string
        message: string
      }
      addresses: AddressRva[]
      lanes: AddressStreet[]
      cities: AddressCommune[]
    }
  }
}

interface AddressRva {
  addr1: string
  addr2: string
  addr3: string
  building: string
  extension: string
  idaddress: string
  idlane: string
  insee: string
  number: string
  x: string
  y: string
  zipcode: string
}

interface AddressCommune {
  insee: string
  lowerCorner: string
  name: string
  name2: string
  nameindex: string
  upperCorner: string
}

interface AddressStreet {
  fantoir: string
  idlane: string
  insee: string
  lowerCorner: string
  name: string
  name2: string
  name3: string
  name4: string
  nameindex: string
  type: string
  upperCorner: string
}

class ApiRvaService {
  // Documention of API : https://api-rva.sig.rennesmetropole.fr/documentation.php

  getApiKey(): string {
    if (process.env.ENV === 'dev') {
      return process.env.RVA_API_KEY as string
    } else {
      return process.env.RVA_API_KEY as string
    }
  }

  async fetchAddress(
    search: string,
    filter: string,
    displayInsee = false
  ): Promise<ApiData> {
    const baseUrl = process.env.RVA_API_URL
    const apiKey = this.getApiKey()
    let url =
      baseUrl +
      `?key=${apiKey}&version=1.0&format=json&epsg=4326&cmd=${filter}&query=${search}`
    if (displayInsee) {
      url += '&insee=all'
    }
    const config = {
      method: 'get' as Method,
      url,
      timeout: 20000, // 20 seconds
    }

    const response = await axios(config)
    const data: ApiData = response.data
    return data
  }

  isDataValid(data: ApiData): boolean {
    const answer = data.rva.answer
    return answer.status.code === '1' && answer.status.message === 'ok'
  }

  async fetchFullAddresses(search: string): Promise<AddressRva[]> {
    const filter = 'getfulladdresses'
    const data = await this.fetchAddress(search, filter)
    if (!this.isDataValid(data)) {
      return []
    }
    return data.rva.answer.addresses
  }

  async fetchStreets(search: string): Promise<AddressStreet[]> {
    const filter = 'getlanes'
    const data = await this.fetchAddress(search, filter, true)
    if (!this.isDataValid(data)) {
      return []
    }
    return data.rva.answer.lanes
  }

  normalizeString(str: string): string {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/-/g, ' ')
      .toLowerCase()
  }

  isString1IncludedInString2(string1: string, string2: string): boolean {
    const normalizedString1 = this.normalizeString(string1)
    const normalizedString2 = this.normalizeString(string2)

    return normalizedString2.includes(normalizedString1)
  }

  async fetchCommunes(search: string): Promise<AddressCommune[]> {
    const filter = 'getcities'
    const data = await this.fetchAddress(search, filter, true)
    if (!this.isDataValid(data)) {
      return []
    }
    const communes = []
    for (const city of data.rva.answer.cities) {
      if (this.isString1IncludedInString2(search, city.name)) {
        communes.push(city)
      }
    }
    return communes
  }
}

export const apiRvaService = new ApiRvaService()
