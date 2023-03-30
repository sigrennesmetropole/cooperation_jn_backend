import axios, { Method } from 'axios';

async function getDistrictConsumptionData(rows: number, codeIris: string) {
    var config = {
        method: 'get' as Method,
        url: `https://data.enedis.fr/api/records/1.0/search/?dataset=consommation-electrique-par-secteur-dactivite-iris&q=&rows=${rows}&sort=annee&facet=annee&facet=code_iris&facet=nom_iris&facet=code_epci&facet=nom_epci&facet=code_categorie_consommation&refine.nom_epci=Rennes+M%C3%A9tropole&refine.code_iris=${codeIris}`,
        headers: { 
        }
    };
    const response = await axios(config)
    return response.data
}

async function getDistrictProductionData(rows: number, codeIris: string) {
    var config = {
        method: 'get' as Method,
        url: `https://data.enedis.fr/api/records/1.0/search/?dataset=production-electrique-par-filiere-a-la-maille-iris&q=&rows=${rows}&sort=-nb_sites_photovoltaique_enedis&facet=annee&facet=nom_iris&facet=code_iris&facet=type_iris&facet=nom_epci&facet=code_epci&facet=domaine_de_tension&refine.nom_epci=Rennes+M%C3%A9tropole&refine.code_iris=${codeIris}`,
        headers: { 
        }
    };
    const response = await axios(config)
    return response.data
}

async function getAllDistrictDatas(callback: any, codeIris: string) {
    const districtData = await callback(500, codeIris)
    const nbHits = districtData.nhits
    const nbGettedData = districtData.records.length
    if(nbHits > nbGettedData) {
        const totalDistrictData = await callback(parseInt(districtData.nhits),codeIris)
        return totalDistrictData
    }
    else {
        return districtData
    }
}

function verifiedYear(year: string) {
    var currentYear = new Date().getFullYear();
    if(year == currentYear.toString()) {
        year = '0'
    }
    return parseInt(year)
}

function filterDataByYear(data: any) {
    var records = data.records.map((r: { fields: any; }) =>r.fields)
    const years = records.map((r: { annee: string; }) => verifiedYear(r.annee))
    const recentYear = Math.max(...years)
    const recordsOfRecentYear = records.filter((r: { annee: string; }) => parseInt(r.annee) == recentYear)
    return recordsOfRecentYear
}

function addRecordsOfRecentYear(key: string, recordOfRecentYear: any) {
    const records = recordOfRecentYear.map((r: { [x: string]: any; }) => r[key])
    const correctedRecords = records.filter((r: number) => r != undefined)
    const totalRecords = correctedRecords.reduce((accumulator: number, currentValue: number) => accumulator + currentValue, 0)
    return totalRecords
}

export async function getTotalDistrictDatas(codeIris: string) {
    try {

        const consumptionData = await getAllDistrictDatas(getDistrictConsumptionData, codeIris)
        const consumptionRecordsOfRecentYear = filterDataByYear(consumptionData)
        const consumptionKey = "conso_totale_mwh"
        const totalConsumptions = addRecordsOfRecentYear(consumptionKey, consumptionRecordsOfRecentYear)

        const productionData = await getAllDistrictDatas(getDistrictProductionData, codeIris)
        const productionRecordsOfRecentYear = filterDataByYear(productionData)
        const productionKey = "energie_produite_annuelle_photovoltaique_enedis_mwh"
        const totalProductions = addRecordsOfRecentYear(productionKey, productionRecordsOfRecentYear)

        const nbPhotovoltaicSites = "nb_sites_photovoltaique_enedis"
        const totalNbPhotovoltaicSites = addRecordsOfRecentYear(nbPhotovoltaicSites, productionRecordsOfRecentYear)

        return {
            totalConsumptione : totalConsumptions,
            totalProduction :  totalProductions,
            totalPhotovoltaicSites : totalNbPhotovoltaicSites
        }

    } catch (error) {
        throw new Error(`HTTP error`);
    }
}