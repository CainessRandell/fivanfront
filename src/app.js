const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./docs/swagger.json');
const app = express();

// Respeita proxies para detectar proto/host corretos
app.set('trust proxy', true);

const parseTrustedOrigins = () => {
  const raw = process.env.TRUSTED_ORIGINS || '';

  return raw
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
};

const trustedOrigins = parseTrustedOrigins();

const corsOptions = {
  origin(origin, callback) {
    // Permite requests sem Origin (curl, Postman, healthchecks)
    if (!origin) {
      callback(null, true);
      return;
    }

    if (trustedOrigins.length === 0 || trustedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

const buildSwaggerDoc = (req) => {
  const doc = JSON.parse(JSON.stringify(swaggerDocument));
  const protoHeader = req.headers['x-forwarded-proto'] || req.protocol || 'http';
  const proto = protoHeader.split(',')[0].trim();
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  if (host) {
    doc.servers = [{ url: `${proto}://${host}` }];
  }
  return doc;
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());

const swaggerUiHandler = swaggerUi.setup(null, { swaggerUrl: '/swagger.json' });
app.use('/api-docs', swaggerUi.serve, swaggerUiHandler);
app.get('/swagger.json', (req, res) => res.json(buildSwaggerDoc(req)));
app.use(routes);

module.exports = app;