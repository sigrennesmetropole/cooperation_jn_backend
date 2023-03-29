import { Request } from 'express';
import { MySessionData } from '../interface/MySessionData';
import axios, { Method } from 'axios';
import qs from 'qs';

async function getDistrictConsumptionData(codeIris: string) {
    var config = {
        method: 'get' as Method,
        // fix me : appel 10 par 10
        url: `https://data.enedis.fr/api/records/1.0/search/?dataset=consommation-electrique-par-secteur-dactivite-iris&q=&rows=20&sort=-annee&facet=annee&facet=code_iris&facet=nom_iris&facet=code_epci&facet=nom_epci&facet=code_categorie_consommation&refine.nom_epci=Rennes+M%C3%A9tropole&refine.code_iris=${codeIris}`,
        headers: { 
        }
    };
    const response = await axios(config)
    return response.data
}

export async function getTotalDistrictConsumption(codeIris: string) {
    try {
        const districtData = await getDistrictConsumptionData(codeIris)
        //récupération de l'objet contenant la consommation
        const consumptionRecords = districtData.records.map((r: { fields: any; }) =>r.fields)

        // détermination de l'année de prise en compte
        const years = consumptionRecords.map((r: { annee: string; }) => parseInt(r.annee))
        const maxYear = Math.max(...years)

        // filtrer résultats sur année
        const consumptionRecordsOfMaxYear = consumptionRecords.filter((r: { annee: string; }) => parseInt(r.annee) == maxYear)

        // somme de la consommation totale
        const consumptions = consumptionRecordsOfMaxYear.map((r: { conso_totale_mwh: number; }) => r.conso_totale_mwh)
        const totalConsumptions = consumptions.reduce((accumulator: number, currentValue: number) => accumulator + currentValue, 0)

        return totalConsumptions

    } catch (error) {
        throw new Error(`HTTP error`);
    }
}