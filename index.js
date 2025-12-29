// index.js
const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const MODRINTH_API_URL = 'https://api.modrinth.com/v2';

const allowedOrigins = [
  'https://rumodrinth.onrender.com',
  'https://rumodrinth.pages.dev',
  'http://localhost:5173'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

app.get('/', (req, res) => {
  res.send('RuModrinth Proxy is running!');
});

app.use('/', createProxyMiddleware({
  target: MODRINTH_API_URL,
  changeOrigin: true,
  pathRewrite: {

  },
  onProxyReq: (proxyReq, req, res) => {

    proxyReq.setHeader('User-Agent', 'RuModrinth/1.0 (yourname@example.com)');
  },
  onError: (err, req, res) => {
    console.error('Proxy Error:', err);
    res.status(500).send('Proxy Error');
  }
}));

app.listen(PORT, () => {
  console.log(`Proxy server is running on port ${PORT}`);

});
