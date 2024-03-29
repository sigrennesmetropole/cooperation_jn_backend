import axios, { type Method } from 'axios'

class ApiSitesorgService {
  // Documention of API : https://api-sitesorg.sig.rennesmetropole.fr/doc/api

  getBaseUrl(): string | undefined {
    return process.env.SITEORG_API_URL
  }

  getApiKey(): string {
    if (process.env.ENV === 'dev') {
      return process.env.SITEORG_API_KEY as string
    } else {
      return process.env.SITEORG_API_KEY as string
    }
  }

  async sendRequest(url: string): Promise<any> {
    const apiKey = this.getApiKey()
    const config = {
      method: 'get' as Method,
      url,
      timeout: 20000, // 20 seconds
      headers: {
        'x-api-key': apiKey,
      },
    }

    const response = await axios(config)
    return response.data
  }

  async fetchOrganizations(search: string): Promise<any> {
    const baseUrl = this.getBaseUrl() + 'recherche'
    const url =
      baseUrl +
      `?termes=${search}&termes_op=AND&types[]=organisme&offset=0&limit=3`
    return await this.sendRequest(url)
  }

  async fetchOrganizationById(id: number): Promise<any> {
    const url = `${this.getBaseUrl()}organismes/${id}`
    return await this.sendRequest(url)
  }

  async fetchSiteById(id: number): Promise<any> {
    const url = `${this.getBaseUrl()}sites/${id}/asGeoJson`
    return await this.sendRequest(url)
  }
}

export const apiSitesorgService = new ApiSitesorgService()
