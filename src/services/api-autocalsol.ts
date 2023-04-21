import axios, { type Method } from 'axios'
import { type AutocalsolType } from '../model/autocalsol.model'

function getUrlFromEnv (): string | undefined {
  return process.env.AUTOCALSOL_URL
}

function getUserFromEnv (): string | undefined {
  return process.env.AUTOCALSOL_USER
}

function getTokenFromEnv (): string | undefined {
  return process.env.AUTOCALSOL_TOKEN
}

function convertTimestamp (timestamp: number): string {
  // Create a new Date object using the timestamp
  const date = new Date(timestamp)

  // Format the date using the built-in methods
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const seconds = date.getSeconds().toString().padStart(2, '0')

  // Return the formatted date string
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

function formatComputeData (compute: AutocalsolType) {
  const prodByMonth = compute.resultConso.tabProdMonth
  const consoByMonth = compute.resultConso.tabConsoMonth
  const prodByHour = compute.resultConso.prodTotale.map(item => {
    return [
      convertTimestamp(item[0]),
      item[1]
    ]
  })
  const consoByHour = compute.resultConso.consoPetit.map(item => {
    return [
      convertTimestamp(item[0]),
      item[1]
    ]
  })
  const consoAnnualInjected = compute.resultConso.energieInjectee / 1000 // Wh to kwH
  const consoAnnualAutoConsumed = compute.resultConso.energieAutoconsommee / 1000 // Wh to kwH
  return {
    prodByMonth,
    consoByMonth,
    prodByHour,
    consoByHour,
    consoAnnualInjected,
    consoAnnualAutoConsumed
  }
}

export async function getComputeData (
  latitude: string,
  longitude: string,
  slope: number,
  azimuth: number,
  annual_consumption: number,
  peak_power: number
) {
  const data = {
    values: {
      batiments: {
        libelle: 'Champ PV n°1',
        inclinaison: slope,
        orientation: azimuth,
        puissanceCrete: peak_power,
        pr: 0.85,
        tech: 'crystSi',
        integration: 'free'
      },
      usePuissanceOnduleur: false,
      consommation: {
        typeConsommateur: 'res1',
        formatConso: 'default-conso',
        consoResidentielBase: {
          typeCompteur: 1,
          qteConso: annual_consumption,
          tarifVente: 0.15,
          tabConsommation: null
        }
      }
    },
    init: true,
    results: {
      puissanceCreteTotale: true,
      resultBatiments: {
        energiePVGIS: true,
        irradianceMoyReal: true,
        energieMeteoByMonth: true
      },
      resultConso: {
        tabProdMonth: true,
        tabConsoMonth: true,
        prodTotale: true,
        consoPetit: true,
        energieInjectee: true,
        energieAutoconsommee: true,
        energieSoutiree: true
      },
      resultAutoConso: {
        tabProdJournaliere: true,
        tabConsoJournaliere: true,
        tabInjectionJournaliere: true
      }
    }
  }
  const url = getUrlFromEnv() + '/api/v1/compute' + '?latitude=' + latitude + '&longitude=' + longitude
  const config = {
    method: 'post' as Method,
    url,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenFromEnv()}`
    },
    data
  }
  try {
    const response = await axios(config)
    const data = response.data
    return formatComputeData(data)
  } catch (error) {
    throw new Error('HTTP error')
  }
}
