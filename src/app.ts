import express, { type Express, type Request, type Response } from 'express'
import dotenv from 'dotenv'
import session from 'express-session'
import {
  getUrlUserAuthorization,
  getAnnualConsumption,
} from './services/api-enedis-dataconnect'
import { getTotalDistrictDatas } from './services/api-enedis-district'
import { getComputeData } from './services/api-autocalsol'
import { getIrisCode } from './services/api-iris'
import { getAddressReverse } from './services/api-address'
import { type MySessionData } from './interface/MySessionData'
import { check, validationResult, body } from 'express-validator'
import { generateHTMLPdf } from './pdf/PdfService'
import { sendEmailPdf } from './mail/MailService'
import { apiRvaService } from './services/api-rva'
import { apiSitesorgService } from './services/api-siteorg'
import cors from 'cors'
import { getConfig } from './config/configService'
import { getSiteMeasurement } from './services/api-exem'
import { getModifiedSitesMeasurement } from './services/api-exem'

import asyncHandler from 'express-async-handler'

// Load environment variables from .env file
dotenv.config()

export const app: Express = express()

app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',')
      // allow requests with no origin (like mobile apps or curl requests)
      if (!origin) {
        callback(null, true)
        return
      }
      if (allowedOrigins != null && !allowedOrigins.includes(origin)) {
        const msg =
          'The CORS policy for this site does not allow access from the specified Origin: ' +
          origin
        callback(new Error(msg), false)
        return
      }
      callback(null, true)
    },
    credentials: true,
  })
)

app.use(
  session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false,
  })
)

app.use(express.json({ limit: '50mb' }))

// ROUTES API ENEDIS USER
app.get(
  '/api/enedis/user/url-authorization',
  (req: Request & { session: MySessionData }, res: Response) => {
    try {
      res.json({ url: getUrlUserAuthorization(req) })
    } catch (error: any) {
      res.status(500).json({ error: error.toString() })
    }
  }
)

app.get(
  '/api/enedis/user/prm',
  (req: Request & { session: MySessionData }, res: Response) => {
    try {
      const prm = req.session.prm
      res.json({ prm })
    } catch (error: any) {
      res.status(500).json({ error: error.toString() })
    }
  }
)

app.post(
  '/api/enedis/user/prm',
  body('prm')
    .isString()
    .notEmpty()
    .withMessage('prm must be a non-empty string'),
  (req: Request & { session: MySessionData }, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    try {
      const prm = req.body.prm as string | undefined
      if (prm === undefined) {
        res.status(400).json({ error: 'Missing required body parameters' })
      }
      req.session.prm = prm
      req.session.save()
      res.json({ prm })
    } catch (error: any) {
      res.status(500).json({ error: error.toString() })
    }
  }
)

app.get(
  '/api/enedis/user/annual-consumption',
  asyncHandler(
    async (req: Request & { session: MySessionData }, res: Response) => {
      try {
        const annual_consumption = await getAnnualConsumption(req)
        res.json({ consumption: annual_consumption })
      } catch (error: any) {
        res.status(500).json({ error: error.toString() })
      }
    }
  )
)

// ROUTES API ENEDIS DISTRICT
app.get(
  '/api/enedis/district/:codeIris',
  [
    check('codeIris')
      .isString()
      .isLength({ min: 1 })
      .withMessage('CodeIris must be a non-empty string')
      .matches(/^[a-z0-9]+$/i)
      .withMessage('CodeIris can only contain alphanumeric characters'),
  ],
  asyncHandler(
    async (req: Request & { session: MySessionData }, res: Response) => {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() })
      }
      try {
        const districtDatas = await getTotalDistrictDatas(req.params.codeIris)
        res.json(districtDatas)
      } catch (error: any) {
        res.status(500).json({ error: error.toString() })
      }
    }
  )
)

// ROUTES API AUTOCALSOL
app.get(
  '/api/autocalsol/data-compute',
  [
    check('latitude')
      .isFloat({ min: -90, max: 90 })
      .withMessage('Invalid latitude'),
    check('longitude')
      .isFloat({ min: -180, max: 180 })
      .withMessage('Invalid longitude'),
    check('slope').isFloat({ min: 0, max: 90 }).withMessage('Invalid slope'),
    check('azimuth')
      .isFloat({ min: -180, max: 180 })
      .withMessage('Invalid azimuth'),
    check('annual_consumption')
      .isFloat({ min: 0 })
      .withMessage('Invalid annual consumption'),
    check('peak_power').isFloat({ min: 0 }).withMessage('Invalid peak power'),
  ],

  asyncHandler(
    async (req: Request & { session: MySessionData }, res: Response) => {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() })
      }

      const latitude = req.query.latitude as string | undefined
      const longitude = req.query.longitude as string | undefined
      const slope = req.query.slope as number | undefined
      const azimuth = req.query.azimuth as number | undefined
      const annual_consumption = req.query.annual_consumption as
        | number
        | undefined
      const peak_power = req.query.peak_power as number | undefined

      if (
        latitude !== undefined &&
        longitude !== undefined &&
        slope !== undefined &&
        azimuth !== undefined &&
        annual_consumption !== undefined &&
        peak_power !== undefined
      ) {
        try {
          const compute = await getComputeData(
            latitude,
            longitude,
            slope,
            azimuth,
            annual_consumption,
            peak_power
          )
          res.json({ compute })
        } catch (error: any) {
          res.status(500).json({ error: error.toString() })
        }
      } else {
        res.status(400).json({ error: 'Missing required query parameters' })
      }
    }
  )
)

// ROUTES API CODE IRIS NEIGHBOURHOOD
app.get(
  '/api/codeiris/:lat/:lon',
  [
    check('lat').isFloat({ min: -90, max: 90 }).toFloat(),
    check('lon').isFloat({ min: -180, max: 180 }).toFloat(),
  ],
  asyncHandler(
    async (req: Request & { session: MySessionData }, res: Response) => {
      try {
        const codeIris = await getIrisCode(req.params.lat, req.params.lon)
        res.json(codeIris)
      } catch (error: any) {
        res.status(500).json({ error: error.toString() })
      }
    }
  )
)

import puppeteer from 'puppeteer'
import { apiConsultationService } from './services/api-consultations'

const pdfMiddleware = [
  body('annual_consumption')
    .isNumeric()
    .withMessage('annual_consumption must be a number'),
  body('currentNumSolarPanel')
    .isNumeric()
    .notEmpty()
    .withMessage('currentNumSolarPanel must be a number not empty'),
  body('latitude').isNumeric().withMessage('latitude must be a number'),
  body('longitude').isNumeric().withMessage('longitude must be a number'),
  body('slope').isNumeric().withMessage('slope must be a number'),
  body('azimuth').isNumeric().withMessage('azimuth must be a number'),
  body('peak_power').isNumeric().withMessage('peak_power must be a number'),
  body('selectedRoof.surface_id')
    .isNumeric()
    .withMessage('surface_id must be a number'),
  body('selectedRoof.values').isArray().withMessage('values must be an array'),
  body('selectedRoof.values.*')
    .isNumeric()
    .withMessage('all values must be numbers'),
  body('selectedRoof.favorable')
    .isNumeric()
    .withMessage('favorable must be a number'),
  body('selectedRoof.total').isNumeric().withMessage('total must be a number'),
  body('selectedRoof.orientation')
    .isString()
    .notEmpty()
    .withMessage('orientation must be a non-empty string'),
  body('selectedRoof.azimuth')
    .isNumeric()
    .withMessage('azimuth must be a number'),
  body('selectedRoof.inclinaison')
    .isNumeric()
    .withMessage('inclinaison must be a number'),
  body('roofImageBase64')
    .isString()
    .withMessage('roofImageBase64 must be a string'),
]

const emailValidationMiddleware = [
  body('email').isEmail().withMessage('Email must be valid'),
]

app.post(
  '/api/email-pdf',
  [...pdfMiddleware, ...emailValidationMiddleware],
  asyncHandler(
    async (req: Request & { session: MySessionData }, res: Response) => {
      console.log('Must be keep alive ')
      res.json({
        etat: 'ok',
        message: 'PDF generation and mailing process has been started.',
      })

      // CREATE PDF
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return
      }

      const html = await generateHTMLPdf(req)
      if (html === null) {
        return
      }

      try {
        const browser = await puppeteer.launch({
          headless: true,
          args: ['--no-sandbox'],
        })
        const page = await browser.newPage()
        await page.setContent(html)
        await page.emulateMediaType('screen')
        await page.setViewport({ width: 1200, height: 800 })
        const pdfBuffer = await page.pdf({
          format: 'A4',
          printBackground: true,
        })
        sendEmailPdf(pdfBuffer, req.body.email)
        await browser.close()
      } catch (error: any) {
        console.error('Error during PDF Generation:', error)
        res.status(500).json({ error: 'Error during PDF Generation' })
      }
    }
  )
)

app.post(
  '/api/pdf',
  pdfMiddleware,
  asyncHandler(
    async (req: Request & { session: MySessionData }, res: Response) => {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() })
      }

      let html: string | null = ''
      try {
        html = await generateHTMLPdf(req)
        if (html === null) {
          res.status(500).json({ error: 'Error during PDF Generation' })
        }
      } catch (error: any) {
        res
          .status(500)
          .json({ error: 'Error during PDF Generation:' + error.toString() })
      }

      try {
        const browser = await puppeteer.launch({
          headless: true,
          args: ['--no-sandbox'],
        })
        const page = await browser.newPage()
        if (html) {
          await page.setContent(html)
        }
        await page.emulateMediaType('screen')
        await page.setViewport({ width: 1200, height: 800 })
        const pdfBuffer = await page.pdf({
          format: 'A4',
          printBackground: true,
        })
        res.setHeader('Content-Type', 'application/pdf')
        res.send(pdfBuffer)
        await browser.close()
      } catch (error: any) {
        res
          .status(500)
          .json({ error: 'Error during PDF Generation:' + error.toString() })
      }
    }
  )
)

app.get(
  '/api/config',
  asyncHandler(
    async (req: Request & { session: MySessionData }, res: Response) => {
      try {
        const config = await getConfig()
        res.json({ config })
      } catch (error: any) {
        res.status(500).json({ error: error.toString() })
      }
    }
  )
)

app.get(
  '/api/address-reverse/:lat/:lon',
  [
    check('lat')
      .isFloat({ min: -90, max: 90 })
      .toFloat()
      .withMessage('Invalid latitude'),
    check('lon')
      .isFloat({ min: -180, max: 180 })
      .toFloat()
      .withMessage('Invalid longitude'),
  ],
  asyncHandler(
    async (req: Request & { session: MySessionData }, res: Response) => {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() })
      } else {
        try {
          const address = await getAddressReverse(
            req.params.lat,
            req.params.lon
          )
          res.json(address)
        } catch (error: any) {
          res.status(500).json({ error: error.toString() })
        }
      }
    }
  )
)

// RVA
app.get(
  '/api/rva/fulladdress',
  [],
  asyncHandler(
    async (req: Request & { session: MySessionData }, res: Response) => {
      try {
        const addresses = await apiRvaService.fetchFullAddresses(
          req.query.q as string
        )
        res.json(addresses)
      } catch (error: any) {
        res.status(500).json({ error: error.toString() })
      }
    }
  )
)

app.get(
  '/api/rva/communes',
  [],
  asyncHandler(
    async (req: Request & { session: MySessionData }, res: Response) => {
      try {
        const communes = await apiRvaService.fetchCommunes(
          req.query.q as string
        )
        res.json(communes)
      } catch (error: any) {
        res.status(500).json({ error: error.toString() })
      }
    }
  )
)

app.get(
  '/api/rva/streets',
  [],
  asyncHandler(
    async (req: Request & { session: MySessionData }, res: Response) => {
      try {
        const streets = await apiRvaService.fetchStreets(req.query.q as string)
        res.json(streets)
      } catch (error: any) {
        res.status(500).json({ error: error.toString() })
      }
    }
  )
)

// Site Org
app.get(
  '/api/siteorg/organizations',
  [],
  asyncHandler(
    async (req: Request & { session: MySessionData }, res: Response) => {
      try {
        const organizations = await apiSitesorgService.fetchOrganizations(
          req.query.q as string
        )
        res.json(organizations)
      } catch (error: any) {
        res.status(500).json({ error: error.toString() })
      }
    }
  )
)

app.get(
  '/api/siteorg/organization/:id',
  [],
  asyncHandler(
    async (req: Request & { session: MySessionData }, res: Response) => {
      try {
        const organization = await apiSitesorgService.fetchOrganizationById(
          req.params.id as unknown as number
        )
        res.json(organization)
      } catch (error: any) {
        res.status(500).json({ error: error.toString() })
      }
    }
  )
)

app.get(
  '/api/siteorg/site/:id',
  [],
  asyncHandler(
    async (req: Request & { session: MySessionData }, res: Response) => {
      try {
        const site = await apiSitesorgService.fetchSiteById(
          req.params.id as unknown as number
        )
        res.json(site)
      } catch (error: any) {
        res.status(500).json({ error: error.toString() })
      }
    }
  )
)
// ROUTES API REAL TIME MESUREMENT

app.get(
  '/api/sitemeasurement/:id',
  [check('id').isString().isLength({ min: 1 })],
  asyncHandler(
    async (req: Request & { session: MySessionData }, res: Response) => {
      try {
        const sitemeasurement = await getSiteMeasurement(req.params.id)
        res.json(sitemeasurement)
      } catch (error: any) {
        res.status(500).json({ error: error.toString() })
      }
    }
  )
)

app.get(
  '/api/sitesmeasurement',
  asyncHandler(
    async (req: Request & { session: MySessionData }, res: Response) => {
      try {
        const sitesmeasurement = await getModifiedSitesMeasurement()
        res.json(sitesmeasurement)
      } catch (error: any) {
        res.status(500).json({ error: error.toString() })
      }
    }
  )
)

// ROUTES API CAP COLLECTIF : CONSULTATIONS INFORMATIONS
app.get(
  '/api/consultations/projects',
  asyncHandler(
    async (req: Request & { session: MySessionData }, res: Response) => {
      try {
        // Check if a query parameter 'count' is provided or invalid, or use a default value
        const count = req.query.count as unknown as number | 10
        if (count > 100) {
          res.status(400).json({ error: 'Maximum count is 100' })
        }
        const consultationsInformations =
          await apiConsultationService.getProjects('TRAMBUS', count)
        res.json(consultationsInformations)
      } catch (error: any) {
        res.status(500).json({ error: error.toString() })
      }
    }
  )
)

// app.get(
//   '/api/check-env',
//   asyncHandler(
//     async (req: Request & { session: MySessionData }, res: Response) => {
//       try {
//         const env = {
//           env: process.env.ENV,
//           SITEORG_API_KEY: process.env.SITEORG_API_KEY,
//           RVA_API_KEY: process.env.RVA_API_KEY,
//           SITEORG_PROD_API_KEY: process.env.SITEORG_PROD_API_KEY,
//           RVA_PROD_API_KEY: process.env.RVA_PROD_API_KEY,
//           FABRIQUE_CITOYENNE_URL: process.env.FABRIQUE_CITOYENNE_URL,
//         }
//         res.json(env)
//       } catch (error: any) {
//         res.status(500).json({ error: error.toString() })
//       }
//     }
//   )
// )
