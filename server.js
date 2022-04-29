const express = require('express');
const app = express();
require('dotenv').config();

const routes = require('./routes');
const PORT = process.env.GATEWAY_PORT ? process.env.GATEWAY_PORT : 3000;


const SECRETS_API_TOKEN = process.env.SECRETS_API_TOKEN ? process.env.SECRETS_API_TOKEN : require('crypto').randomBytes(48, function(err, buffer) {
    let token = buffer.toString('hex');
    console.log("======> Your secret token is : "+token );
    process.env['SECRETS_API_TOKEN'] = token;
    return token;
    });

app.use(express.json());

app.use('/', routes);

app.use(express.static('pages'));

app.listen(PORT, () => {
console.log("Gateway is ready and listening at "+PORT)
})

