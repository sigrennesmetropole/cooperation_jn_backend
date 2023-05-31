import axios, { type Method } from 'axios'
import { type AutocalsolType } from '../model/autocalsol.model'
import { getConfigFromKey } from '../config/configService'

const date_prod_conso = getConfigFromKey('autocalsol.date_prod_conso')

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
    hour12: false
  })

  // Extract the date parts
  let [
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
    { value: second }
  ] = dateFormatter.formatToParts(date)

  if (hour == '24') {
    hour = '00'
  }

  // Return the formatted date string
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`
}

// The consumption and production data are taken over a single day: date_prod_conso
function getFormattedProdAndConso (data: Array<[number, string]>) {
  const dataFilterredOnTheGoodDay: Array<[string, string | number]> = []

  data.forEach((item) => {
    const date = convertTimestamp(item[0])
    if (date.match('-' + date_prod_conso + ' ') != null) {
      const hours = date.split(' ')[1]
      // Half-hour data is not taken into account
      if (hours.match(':30:') == null) {
        dataFilterredOnTheGoodDay.push(
          [hours, parseInt(item[1])]
        )
      }
    }
  })
  if (dataFilterredOnTheGoodDay.length !== 24) {
    return []
  }
  return dataFilterredOnTheGoodDay
}

function formatComputeData (compute: AutocalsolType) {
  const prodByMonth = compute.resultConso.tabProdMonth
  const consoByMonth = compute.resultConso.tabConsoMonth
  const prodByHour = getFormattedProdAndConso(compute.resultConso.prodTotale)
  const consoByHour = getFormattedProdAndConso(compute.resultConso.consoPetit)

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
        pr: getConfigFromKey('autocalsol.pr'),
        tech: getConfigFromKey('autocalsol.tech'),
        integration: getConfigFromKey('autocalsol.integration')
      },
      usePuissanceOnduleur: false,
      consommation: {
        typeConsommateur: 'res1',
        formatConso: 'default-conso',
        consoResidentielBase: {
          typeCompteur: getConfigFromKey('autocalsol.typeCompteur'),
          qteConso: annual_consumption,
          tarifVente: getConfigFromKey('autocalsol.tarifVente'),
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
  const url = getUrlFromEnv() + '/api/v1/compute' + '?latitude=' + encodeURIComponent(latitude) + '&longitude=' + encodeURIComponent(longitude)
  const config = {
    method: 'post' as Method,
    url,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenFromEnv()}`
    },
    data,
    timeout: 60000 // 60 secondes
  }
  try {
    const response = await axios(config)
    const data2 = response.data
    return formatComputeData(data2)
  } catch (error) {
    // @ts-ignore
    throw new Error('Error during get consumption: ' + error.message)
  }
}
