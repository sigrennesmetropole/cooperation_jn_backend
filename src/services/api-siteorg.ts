const fetch = require('node-fetch')

class ApiSitesorgService {
  // Documention of API : https://api-sitesorg.sig.rennesmetropole.fr/doc/api

  private readonly baseUrl = 'https://api-sitesorg.sig.rennesmetropole.fr/v1/'

  getApiKey (): string {
    if (process.env.ENV === 'dev') {
      return process.env.SITEORG_API_KEY as string
    } else {
      return process.env.SITEORG_PROD_API_KEY as string
    }
  }

  async sendRequest (url: string): Promise<any> {
    const apiKey = this.getApiKey()
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-api-key': apiKey
      }
    })
    const data = await response.json()
    return data
  }

  async fetchOrganizations (search: string): Promise<any> {
    const baseUrl = this.baseUrl + 'recherche'
    const url =
        baseUrl +
        `?termes=${search}&termes_op=AND&types[]=organisme&offset=0&limit=3`
    return await this.sendRequest(url)
  }

  async fetchOrganizationById (id: number): Promise<any> {
    const url = `${this.baseUrl}organismes/${id}`
    return await this.sendRequest(url)
  }

  async fetchSiteById (id: number): Promise<any> {
    const url = `${this.baseUrl}sites/${id}/asGeoJson`
    return await this.sendRequest(url)
  }
}

export const apiSitesorgService = new ApiSitesorgService()