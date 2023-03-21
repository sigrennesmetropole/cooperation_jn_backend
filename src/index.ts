import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import session, { SessionData, SessionOptions } from 'express-session';
import { getUrlUserAuthorization, getAnnualConsumption } from './services/api-enedis';
import { MySessionData } from './interface/MySessionData';

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

app.use(express.json());

// ROUTES API
app.get('/api/enedis/user/url-authorization', (req: Request & { session: MySessionData }, res: Response) => {
  res.json({ url: getUrlUserAuthorization(req) });
});

app.get('/api/enedis/user/prm', (req: Request & { session: MySessionData }, res: Response) => {
  const prm = req.session.prm
  res.json({ prm: prm });
});

app.post('/api/enedis/user/prm', (req: Request & { session: MySessionData }, res: Response) => {
  const prm = req.body.prm
  if(prm !== undefined){
    req.session.prm = prm
    req.session.save()
  }
  res.json({ prm: prm });
});

app.get(
  '/api/enedis/user/annual-consumption', 
  async (req: Request & { session: MySessionData }, res: Response) => {
    res.json({ consumption: await getAnnualConsumption(req) });
  }
);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Running on port ${port}`);
});
