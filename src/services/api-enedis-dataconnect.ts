import { Request } from 'express';
import { MySessionData } from '../interface/MySessionData';
import axios, { Method } from 'axios';
import qs from 'qs';

export function getUrlUserAuthorization(req: Request & { session: MySessionData }) {
    req.session.state = (Math.random() + 1).toString(36).substring(7)
    req.session.save()
    const url =
        'https://mon-compte-particulier.enedis.fr/dataconnect/v1/oauth2/authorize' +
        '?' +
        `client_id=${process.env.ENEDIS_CLIENT_ID}` +
        `&state=${req.session.state}` +
        `&duration=${process.env.ENEDIS_CLIENT_DURATION}` + // duration est la durée du consentement que vous souhaitez obtenir : cette durée est à renseigner au format ISO 8601 (exemple : « P6M » pour une durée de 6 mois),
        '&response_type=code'
    return url
}

function getUrlFromEnv(){
    if(process.env.ENV === 'dev'){
        return process.env.ENEDIS_URL_SANDBOX
    } else {
        return process.env.ENEDIS_URL_PRODUCTION
    }
}

async function getUserAccessToken() {
    var data = qs.stringify({
        'grant_type': 'client_credentials',
        'client_id':  process.env.ENEDIS_CLIENT_ID,
        'client_secret': process.env.ENEDIS_CLIENT_SECRET 
    });
    var config = {
        method: 'post' as Method,
        url: getUrlFromEnv() + '/oauth2/v3/token',
        headers: { 
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data : data
    };

    const response = await axios(config)
    return response.data
}

async function getDailyConsumption(access_token: string, prm: string, start: string, end: string) {
    var config = {
        method: 'get' as Method,
        url: `${getUrlFromEnv()}/metering_data_dc/v5/daily_consumption?start=${start}&end=${end}&usage_point_id=${prm}`,
        headers: { 
            'Authorization': `Bearer ${access_token}`,
            'accept': `application/json`
        }
    };
    const response = await axios(config)
    return response.data
}

function calculateAnnualConsumption(interval_reading: [{value: string, date: string}]){
    let annualConsumption = 0
    interval_reading.forEach((item) => {
        annualConsumption += parseInt(item.value)
    })
    return annualConsumption
}

export async function getAnnualConsumption(req: Request & { session: MySessionData }){
    const prm = req.session.prm
    if(prm === undefined){
        throw new Error(`PRM undefined`);
    }
    try {
        const token_response = await getUserAccessToken()
        const access_token = token_response.access_token
        const start = new Date().getFullYear() - 1 + '-01-01'
        const end = new Date().getFullYear() - 1 + '-12-31'
        const consumption_response = await getDailyConsumption(access_token, prm, start, end)
        if(
            consumption_response.meter_reading === undefined
            || consumption_response.meter_reading.interval_reading === undefined
        ){
            throw new Error(`consumption_response.meter_reading.interval_reading undefined`);
        }
        const interval_reading = consumption_response.meter_reading.interval_reading
        const annualConsumption = calculateAnnualConsumption(interval_reading)
        if(
            consumption_response.meter_reading.reading_type === undefined
        ){
            throw new Error(`consumption_response.meter_reading.reading_type undefined`);
        }
        const reading_type = consumption_response.meter_reading.reading_type
        return {
            annual_consumption: annualConsumption,
            reading_type: reading_type
        }
    } catch (error) {
        throw new Error(`HTTP error`);
    }  
}