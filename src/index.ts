import express, {Express, Request, Response} from 'express';
import dotenv from 'dotenv';
import session, {SessionData, SessionOptions} from 'express-session';
import {getUrlUserAuthorization, getAnnualConsumption} from './services/api-enedis-dataconnect';
import {getTotalDistrictDatas} from './services/api-enedis-district';
import {getComputeData} from './services/api-autocalsol';
import { getIrisCode } from './services/api-iris';
import {MySessionData} from './interface/MySessionData';
import { check, validationResult, body } from 'express-validator';
import { getPdfHtml } from './pdf/PdfHtml';

const asyncHandler = require('express-async-handler')

// Load environment variables from .env file
dotenv.config();

const app: Express = express();

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*'); // Set to the request's origin or use a specific domain
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', 'true'); // Allow credentials (cookies) to be sent
    next();
});

app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false,
}));

app.use(express.json( {limit: '50mb'} ));

// ROUTES API ENEDIS USER
app.get('/api/enedis/user/url-authorization', (req: Request & { session: MySessionData }, res: Response) => {
    res.json({url: getUrlUserAuthorization(req)});
});

app.get('/api/enedis/user/prm', (req: Request & { session: MySessionData }, res: Response) => {
    const prm = req.session.prm
    res.json({prm: prm});
});

app.post(
  '/api/enedis/user/prm', 
  body('prm').isString().notEmpty().withMessage('prm must be a non-empty string'),
  (req: Request & { session: MySessionData }, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const prm = req.body.prm as string | undefined;
    if (prm === undefined) {
        res.status(400).json({error: 'Missing required body parameters'});
    }
    req.session.prm = prm
    req.session.save()
    res.json({prm: prm});
  }
);

app.get(
    '/api/enedis/user/annual-consumption',
    asyncHandler(async (req: Request & { session: MySessionData }, res: Response) => {
            const annual_consumption = await getAnnualConsumption(req)
            res.json({consumption: annual_consumption});
        }
    ));

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
  asyncHandler(async (req: Request & { session: MySessionData }, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const districtDatas = await getTotalDistrictDatas(req.params.codeIris)
    res.json(districtDatas);
  })
);

// ROUTES API AUTOCALSOL
app.get(
  '/api/autocalsol/data-compute',
  [
      check('latitude').isFloat({ min: -90, max: 90 }).withMessage('Invalid latitude'),
      check('longitude').isFloat({ min: -180, max: 180 }).withMessage('Invalid longitude'),
      check('slope').isFloat({ min: 0, max: 90 }).withMessage('Invalid slope'),
      check('azimuth').isFloat({ min: -180, max: 180}).withMessage('Invalid azimuth'),
      check('annual_consumption').isFloat({ min: 0 }).withMessage('Invalid annual consumption'),
      check('peak_power').isFloat({ min: 0 }).withMessage('Invalid peak power'),
  ],
  asyncHandler(async (req: Request & { session: MySessionData }, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const latitude = req.query.latitude as string | undefined;
        const longitude = req.query.longitude as string | undefined;
        const slope = req.query.slope as number | undefined;
        const azimuth = req.query.azimuth as number | undefined;
        const annual_consumption = req.query.annual_consumption as number | undefined;
        const peak_power = req.query.peak_power as number | undefined;

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
        );
        res.json({ compute: compute });
        
      } catch (error) {
        res.status(500).json({ error: 'internal server error' });
      }
    } else {
      res.status(400).json({ error: 'Missing required query parameters' });
    }
  })
);

// ROUTES API CODE IRIS NEIGHBOURHOOD
app.get(
  '/api/codeiris/:lat/:lon',
  [
    check('lat').isFloat({ min: -90, max: 90 }).toFloat(),
    check('lon').isFloat({ min: -180, max: 180 }).toFloat(),
  ],
  asyncHandler(async (req: Request & { session: MySessionData }, res: Response) => {
    const codeIris = await getIrisCode(req.params.lat, req.params.lon)
    res.json(codeIris);
  })
);

const puppeteer = require('puppeteer');
const fs = require('fs');

app.post(
  '/api/pdf',
  [
    body('address').isString().notEmpty().withMessage('address must be a string not empty'),
    body('annual_consumption').isNumeric().withMessage('annual_consumption must be a number'),
    body('currentNumSolarPanel').isNumeric().notEmpty().withMessage('currentNumSolarPanel must be a number not empty'),
    body('latitude').isNumeric().withMessage('latitude must be a number'),
    body('longitude').isNumeric().withMessage('longitude must be a number'),
    body('slope').isNumeric().withMessage('slope must be a number'),
    body('azimuth').isNumeric().withMessage('azimuth must be a number'),
    body('peak_power').isNumeric().withMessage('peak_power must be a number'),
    body('selectedRoof.surface_id').isNumeric().withMessage('surface_id must be a number'),
    body('selectedRoof.values').isArray().withMessage('values must be an array'),
    body('selectedRoof.values.*').isNumeric().withMessage('all values must be numbers'),
    body('selectedRoof.favorable').isNumeric().withMessage('favorable must be a number'),
    body('selectedRoof.total').isNumeric().withMessage('total must be a number'),
    body('selectedRoof.orientation').isString().notEmpty().withMessage('orientation must be a non-empty string'),
    body('selectedRoof.azimuth').isNumeric().withMessage('azimuth must be a number'),
    body('selectedRoof.inclinaison').isNumeric().withMessage('inclinaison must be a number'),
    body('roofImageBase64').isString().withMessage('roofImageBase64 must be a string'),
  ],
  asyncHandler(async (req: Request & { session: MySessionData }, res: Response)  => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    console.log("Must be keep alive ");
    res.json({ message: 'PDF generation and mailing process has been started.' });

    /* Get data autocalsol */
    console.log('autocalsol')
    let data_autocalsol
    try {
      data_autocalsol = await getComputeData(
        req.body.latitude,
        req.body.longitude,
        req.body.slope,
        req.body.azimuth,
        req.body.annual_consumption,
        req.body.peak_power
      );      
    } catch (error) {
      res.status(500).json({ error: 'internal server error' });
    }

    /* Get data district */
    console.log('district')
    let irisCode = await getIrisCode(
      req.body.latitude.toString(),
      req.body.longitude.toString()  
    )
    console.log('irisCode', irisCode)
    let districtDatas = null
    if (irisCode !== null && irisCode == 0) {
      districtDatas = await getTotalDistrictDatas(irisCode)
    } else {
      irisCode = 0
    }

    /* CREATE PDF */
    if(data_autocalsol === undefined || data_autocalsol === null) {
      res.status(500).json({ error: 'internal server error' });
      return
    }

    // Your HTML content
    console.log('get pdf')
    const html = await getPdfHtml(
      // @ts-ignore
      data_autocalsol,
      req.body.selectedRoof,
      req.body.address,
      req.body.annual_consumption,
      req.body.currentNumSolarPanel,
      req.body.peak_power,
      districtDatas === null ? 0 : districtDatas?.totalPhotovoltaicSites,
      districtDatas === null ? 0 : districtDatas?.totalConsumption,
      req.body.roofImageBase64
    )
    console.log('end html')

    try {
      // Launch a new browser instance
      const browser = await puppeteer.launch();

      // Create a new page in the browser
      const page = await browser.newPage();

      // Set the HTML content of the page
      await page.setContent(html);
      
      // Set the page size
      await page.emulateMediaType('screen');
      await page.setViewport({ width: 1200, height: 800 })

      // Generate the PDF
      const pdfBuffer = await page.pdf({ 
        format: 'A4',
        printBackground: true,     
      });

      // Save the PDF to a file
      fs.writeFileSync('./output.pdf', pdfBuffer);

      // Clean up: close the browser
      await browser.close();

      console.log('finish')
    } catch (error) {
      console.error("Error in PDF Generation:", error);
    }
  })
);


const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Running on port ${port}`);
});
