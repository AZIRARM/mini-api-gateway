const express = require('express');
const app = express();
require('dotenv').config();

const routes = require('./routes');
const PORT = process.env.GATEWAY_PORT ? process.env.GATEWAY_PORT : 3000;

app.use(express.json());

app.use('/', routes);

app.listen(PORT, () => {
console.log("Gateway is ready and listening at "+PORT)
})