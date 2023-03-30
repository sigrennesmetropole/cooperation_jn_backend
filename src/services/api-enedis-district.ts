import { Request } from 'express';
import { MySessionData } from '../interface/MySessionData';
import axios, { Method } from 'axios';
import qs from 'qs';

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

async function getdistrictDatas(codeIris: string) {
    const districtData = await getDistrictConsumptionData(10, codeIris)

    const nbHits = districtData.nhits
    const nbGettedData = districtData.records.length

    if(nbHits > nbGettedData) {
        const totalDistrictData = await getDistrictConsumptionData(parseInt(districtData.nhits),codeIris)
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


export async function getTotalDistrictConsumption(codeIris: string) {
    try {
        const data = await getdistrictDatas(codeIris)
        // récupération de l'objet contenant la consommation
        var consumptionRecords = data.records.map((r: { fields: any; }) =>r.fields)

        // détermination de l'année de prise en compte
        const years = consumptionRecords.map((r: { annee: string; }) => verifiedYear(r.annee))
        const maxYear = Math.max(...years)

        // filtrer résultats sur année
        const consumptionRecordsOfMaxYear = consumptionRecords.filter((r: { annee: string; }) => parseInt(r.annee) == maxYear)

        // somme de la consommation totale
        const consumptions = consumptionRecordsOfMaxYear.map((r: { conso_totale_mwh: number; }) => r.conso_totale_mwh)

        // filtrer pour enlever les valeur undefined
        const correctedConsumptions = consumptions.filter((r: number) => r != undefined)
        const totalConsumptions = correctedConsumptions.reduce((accumulator: number, currentValue: number) => accumulator + currentValue, 0)
        return totalConsumptions

    } catch (error) {
        throw new Error(`HTTP error`);
    }
}