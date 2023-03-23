import axios, { Method } from 'axios';
import qs from 'qs';

function getUrlFromEnv(){
    return process.env.AUTOCALSOL_URL
}

function getUserFromEnv(){
    return process.env.AUTOCALSOL_USER
}

function getTokenFromEnv(){
    return process.env.AUTOCALSOL_TOKEN
}

function convertTimestampToDate(timestamp: number){
    const date = new Date(timestamp * 1000)
    return date.toISOString().split('T')[0]
}

export async function getComputeData(
    latitude: string, 
    longitude: string,
    slope: number,
    azimuth: number,
    annual_consumption: number,
    peak_power: number
) {
    var data = {
        "values": {
            "batiments" :{
                "libelle": "Champ PV n°1",
                "inclinaison": slope,
                "orientation": azimuth,
                "puissanceCrete": peak_power,
                "pr": 0.85,
                "tech": "crystSi",
                "integration": "free"
            },
            "usePuissanceOnduleur": false,
            "consommation": {
                "typeConsommateur": "res1",
                "formatConso": "default-conso",
                "consoResidentielBase": {
                    "typeCompteur": 1,
                    "qteConso": annual_consumption,
                    "tarifVente": 0.15,
                    "tabConsommation": null
                }
            }
        },
        "init": true,
        "results": {
            "puissanceCreteTotale": true,
            "resultBatiments": {
                "energiePVGIS": true,
                "irradianceMoyReal": true,
                "energieMeteoByMonth": true
            },
            "resultConso":{
                "tabProdMonth": true,
                "tabConsoMonth": true,
                "prodTotale": true,
                "consoPetit": true,
                "energieInjectee": true,
                "energieAutoconsommee": true,
                "energieSoutiree": true
            },
            "resultAutoConso":{
                "tabProdJournaliere": true,
                "tabConsoJournaliere": true,
                "tabInjectionJournaliere": true
            }
        }
    };
    const url = getUrlFromEnv() + '/api/v1/compute' + '?latitude=' + latitude + '&longitude=' + longitude
    var config = {
        method: 'post' as Method,
        url: url,
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getTokenFromEnv()}`,
        },
        data : data
    };
    try {
        const response = await axios(config)
        return response.data
    } catch (error) {
        throw new Error(`HTTP error`);
    }
}