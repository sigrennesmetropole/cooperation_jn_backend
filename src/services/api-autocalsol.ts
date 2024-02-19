import axios, { type Method } from 'axios'
import { type AutocalsolType } from '../model/autocalsol.model'
import { getConfigFromKey } from '../config/configService'

function getUrlFromEnv(): string | undefined {
  return process.env.AUTOCALSOL_URL
}

function getTokenFromEnv(): string | undefined {
  return process.env.AUTOCALSOL_TOKEN
}

function convertTimestamp(timestamp: number): string {
  const date = new Date(timestamp)

  // Use the Intl.DateTimeFormat object to format the date in Paris timezone
  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Europe/Paris',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })

  // Extract the date parts
  const [
    { value: month },
    ,
    { value: day },
    ,
    { value: year },
    ,
    { value: hour },
    ,
    { value: minute },
    ,
    { value: second },
  ] = dateFormatter.formatToParts(date)

  let hour00 = hour
  if (hour == '24') {
    hour00 = '00'
  }

  // Return the formatted date string
  return `${year}-${month}-${day} ${hour00}:${minute}:${second}`
}

// The consumption and production data are taken over a single day: date_prod_conso
async function getFormattedProdAndConso(data: Array<[number, string]>) {
  const dataFilterredOnTheGoodDay: Array<[string, string | number]> = []
  const date_prod_conso = await getConfigFromKey('autocalsol.date_prod_conso')

  data.forEach((item) => {
    const date = convertTimestamp(item[0])
    if (date.startsWith(date_prod_conso + ' ')) {
      const hours = date.split(' ')[1]
      // Half-hour data is not taken into account
      if (hours.match(':30:') == null) {
        dataFilterredOnTheGoodDay.push([hours, parseInt(item[1])])
      }
    }
  })
  if (dataFilterredOnTheGoodDay.length !== 24) {
    return []
  }
  return dataFilterredOnTheGoodDay
}

async function formatComputeData(compute: AutocalsolType) {
  const prodByMonth = compute.resultConso.tabProdMonth
  const consoByMonth = compute.resultConso.tabConsoMonth
  const prodByHour = await getFormattedProdAndConso(
    compute.resultConso.prodTotale
  )
  const consoByHour = await getFormattedProdAndConso(
    compute.resultConso.consoPetit
  )

  const consoAnnualInjected = compute.resultConso.energieInjectee / 1000 // Wh to kwH
  const consoAnnualAutoConsumed =
    compute.resultConso.energieAutoconsommee / 1000 // Wh to kwH
  return {
    prodByMonth,
    consoByMonth,
    prodByHour,
    consoByHour,
    consoAnnualInjected,
    consoAnnualAutoConsumed,
  }
}

export async function getComputeData(
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
        pr: await getConfigFromKey('autocalsol.pr'),
        tech: await getConfigFromKey('autocalsol.tech'),
        integration: await getConfigFromKey('autocalsol.integration'),
      },
      usePuissanceOnduleur: false,
      consommation: {
        typeConsommateur: 'res1',
        formatConso: 'default-conso',
        consoResidentielBase: {
          typeCompteur: await getConfigFromKey('autocalsol.typeCompteur'),
          qteConso: annual_consumption,
          tarifVente: await getConfigFromKey('autocalsol.tarifVente'),
          tabConsommation: null,
        },
      },
    },
    init: true,
    results: {
      puissanceCreteTotale: true,
      resultBatiments: {
        energiePVGIS: true,
        irradianceMoyReal: true,
        energieMeteoByMonth: true,
      },
      resultConso: {
        tabProdMonth: true,
        tabConsoMonth: true,
        prodTotale: true,
        consoPetit: true,
        energieInjectee: true,
        energieAutoconsommee: true,
        energieSoutiree: true,
      },
      resultAutoConso: {
        tabProdJournaliere: true,
        tabConsoJournaliere: true,
        tabInjectionJournaliere: true,
      },
    },
  }
  const url =
    getUrlFromEnv() +
    '/api/v1/compute' +
    '?latitude=' +
    encodeURIComponent(latitude) +
    '&longitude=' +
    encodeURIComponent(longitude)
  const config = {
    method: 'post' as Method,
    url,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenFromEnv()}`,
    },
    data,
    timeout: 60000, // 60 secondes
  }
  try {
    const response = await axios(config)
    const data2 = response.data
    return await formatComputeData(data2)
  } catch (error: any) {
    console.error(
      `Error proxying: ${url} with token ${getTokenFromEnv()} and data: ${JSON.stringify(
        data
      )}`
    )
    console.error(error)
    throw new Error('Error during get consumption: ' + error.message)
  }
}
