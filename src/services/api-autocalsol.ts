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
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const seconds = date.getSeconds().toString().padStart(2, '0')

  // Return the formatted date string
  return `${hours}:${minutes}:${seconds}`
}

function avgOfProdAndConso(data: [number, string][]): [string, number][] {
  let dataAvg: { [key: string]: { total: number; count: number } } = {};

  for (let i = 0; i < 24; i++) {
    let hour = `${i}:00:00`;
    hour = parseInt(hour) < 10 ? "0" + hour : hour;
    dataAvg[hour] = {
      total: 0,
      count: 0,
    };
  }

  data.forEach((item) => {
    const hour = convertTimestamp(item[0]);
    if (dataAvg[hour]) {
      dataAvg[hour].total += parseInt(item[1]);
      dataAvg[hour].count += 1;
    }
  });

  return Object.keys(dataAvg).map((key) => {
    return [key, Math.round(dataAvg[key].total / dataAvg[key].count)];
  });
}

function formatComputeData (compute: AutocalsolType) {
  const prodByMonth = compute.resultConso.tabProdMonth
  const consoByMonth = compute.resultConso.tabConsoMonth
  const prodByHour = avgOfProdAndConso(compute.resultConso.prodTotale)
  const consoByHour = avgOfProdAndConso(compute.resultConso.consoPetit)
 
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
    const data2 = response.data
    return formatComputeData(data2)
  } catch (error) {
    throw new Error('HTTP error')
  }
}
