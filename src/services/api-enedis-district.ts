import axios, { type Method } from 'axios'
const baseURL = 'https://data.enedis.fr/api/records/1.0/search/'

async function getDistrictConsumptionData (rows: number, codeIris: string) {
  const config = {
    method: 'get' as Method,
    url: baseURL,
    params: {
      dataset: 'consommation-electrique-par-secteur-dactivite-iris',
      q: '',
      rows,
      sort: 'annee',
      facet: ['annee', 'code_iris', 'nom_iris', 'code_epci', 'nom_epci', 'code_categorie_consommation'].join(','),
      'refine.nom_epci': 'Rennes Métropole',
      'refine.code_iris': codeIris
    },
    timeout: 20000 // 20 secondes
  }
  try {
    const response = await axios(config)
    return response.data
  } catch (error: any) {
    throw new Error('Error get data district: ' + error.message)
  }

  }


async function getDistrictProductionData (rows: number, codeIris: string) {
  const config = {
    method: 'get' as Method,
    url: baseURL,
    params: {
      dataset: 'production-electrique-par-filiere-a-la-maille-iris',
      q: '',
      rows,
      sort: '-nb_sites_photovoltaique_enedis',
      facet: ['annee', 'nom_iris', 'code_iris', 'type_iris', 'nom_epci', 'code_epci', 'domaine_de_tension'].join(','),
      'refine.nom_epci': 'Rennes Métropole',
      'refine.code_iris': codeIris
    },
    timeout: 20000 // 20 secondes
  }
  try {
    const response = await axios(config)
    return response.data
  } catch (error: any) {
    throw new Error('Error get data district: ' + error.message)
  }
}

async function getAllDistrictDatas (callback: any, codeIris: string) {
  const districtData = await callback(500, codeIris)
  const nbHits = districtData.nhits
  const nbGettedData = districtData.records.length
  if (nbHits > nbGettedData) {
    const totalDistrictData = await callback(parseInt(districtData.nhits), codeIris)
    return totalDistrictData
  } else {
    return districtData
  }
}

function verifiedYear (year: string) {
  const currentYear = new Date().getFullYear()
  if (year == currentYear.toString()) {
    year = '0'
  }
  return parseInt(year)
}

function filterDataByYear (data: any) {
  const records = data.records.map((r: { fields: any }) => r.fields)
  const years = records.map((r: { annee: string }) => verifiedYear(r.annee))
  const recentYear = Math.max(...years)
  const recordsOfRecentYear = records.filter((r: { annee: string }) => parseInt(r.annee) == recentYear)
  return recordsOfRecentYear
}

function getIrisName (data: any) {
  const records = data.records.map((r: { fields: any }) => r.fields)
  const irisName = records[0].nom_iris
  return irisName
}

function addRecordsOfRecentYear (key: string, recordOfRecentYear: any) {
  const records = recordOfRecentYear.map((r: Record<string, any>) => r[key])
  const correctedRecords = records.filter((r: number) => r != undefined)
  const totalRecords = correctedRecords.reduce((accumulator: number, currentValue: number) => accumulator + currentValue, 0)
  return totalRecords
}

export async function getTotalDistrictDatas (codeIris: string) {
  try {
    const consumptionData = await getAllDistrictDatas(getDistrictConsumptionData, codeIris)
    const consumptionRecordsOfRecentYear = filterDataByYear(consumptionData)
    const consumptionKey = 'conso_totale_mwh'
    const totalConsumptions = addRecordsOfRecentYear(consumptionKey, consumptionRecordsOfRecentYear)

    const productionData = await getAllDistrictDatas(getDistrictProductionData, codeIris)
    const productionRecordsOfRecentYear = filterDataByYear(productionData)
    const productionKey = 'energie_produite_annuelle_photovoltaique_enedis_mwh'
    const totalProductions = addRecordsOfRecentYear(productionKey, productionRecordsOfRecentYear)

    const nbPhotovoltaicSites = 'nb_sites_photovoltaique_enedis'
    const totalNbPhotovoltaicSites = addRecordsOfRecentYear(nbPhotovoltaicSites, productionRecordsOfRecentYear)

    const irisName = getIrisName(consumptionData)

    return {
      irisName,
      totalConsumption: totalConsumptions,
      totalProduction: totalProductions,
      totalPhotovoltaicSites: totalNbPhotovoltaicSites
    }
  } catch (error: any) {
    throw new Error('Error get data district: ' + error.message)
  }
}
