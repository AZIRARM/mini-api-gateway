const express = require('express');
const router = express.Router();

const request = require('request');

const fs = require('fs');

let jsonContent = fs.readFileSync('confs/settings.json');
let settings = JSON.parse(jsonContent);

console.log(settings);


router.all('/gateway/*', (req, resp) => {

    let url = req.protocol + '://' + req.get('host') + req.originalUrl;
    checkUrl(resp, url, false);

    url = url.split('?')[0]
    checkUrl(resp, url, false);

    url = url.split('/gateway')[1]
    checkUrl(resp, url, true);


    let api = url.split('/')[1];
    console.debug("API Requested : "+api);

    settings.filter(setting => setting.apiName ===  api).map(
        setting => {
            console.debug("Api name : "+ setting.apiName);
            console.debug("Api url : "+ setting.apiUrl);
            console.debug("Api description: "+ setting.apiDescription);
            console.debug("Api version : "+ setting.apiVersion);
            console.debug("Api authentication type: "+ setting.authenticationType);

            let path = url.replace('/'+api,'');

            if(path === '') {
                path = '/';
            }

            console.debug("--> Path  : "+ path);
            console.debug("--> Method  : "+ req.method);
            console.debug("--> Headers  : "+ JSON.stringify(req.headers));
            console.debug("--> Body  : "+ JSON.stringify(req.body));

            let authenticationSuccess = false;

             if(setting.authenticationType === 'token') {
                console.debug("Token Authentication");
                authenticationSuccess = checkAuthentication(req.query.token, setting, resp);
             }
             if(setting.authenticationType === 'api-key') {
                console.debug("Api-Key Authentication");
                authenticationSuccess = checkAuthentication(req.header('api-key'), setting, resp);
              }

              if(authenticationSuccess) {
                let route = req.protocol + '://' + req.get('host') + req.originalUrl;
                route = route.replace(api, '');
                route = route.replace(/\/\//g, "/");

                route = setting.apiUrl + route.split('/gateway')[1];

                if(setting.authenticationType === 'token') {
                     route = route.replace('token='+req.query.token,'');
                     if(!route.includes('&') && route.includes('?')) {
                        route = route.replace('?','');
                     }
                }

                delete req.headers['api-key'];
                delete req.headers['user-agent'];


                startRequest(req, resp, req.method, route, JSON.stringify(req.headers), JSON.stringify(req.body));
              } else {
                resp.statusCode = 500;
                resp.send("An error in your configuration is present, please check the configuration file before continuing");
                return ;
              }


        }
    );

} );


const checkUrl = ((resp, url, checkQueryParams) => {
    if(url !== null || (checkQueryParams && !url.includes('&')) || (checkQueryParams && !url.includes('?'))) {
        return true;
     }
    console.error("Malformed URL");
    resp.statusCode = 500;
    resp.send("Malformed URL");
});

const checkAuthentication = ((secret, setting, response) => {
     console.error("Client-secret : " + secret);

     if(!setting || secret !== setting.authenticationSecret) {
             console.error("You do not have the necessary permissions to access this resource");
             response.statusCode = 401;
             response.send("You do not have the necessary permissions to access this resource");
             return ;
     }
    return true;
});

const startRequest =  ((req, resp, method, route, headers, body) => {
    console.log("----> Call route " + route + ", Method : " + method);
    request({
         headers: {
            'Accept': req.headers['accept'],
            'Content-Type': req.headers['content-Type']
          },
         uri: route,
         body: body,
         method: method
       }, function (err, res, body) {
            if (err) {
                console.log(err);
                return ;
            }
            if(res.statusCode >= 400) {
                console.error("Error occurred when call  : " + route + ", Method : " + method + ", Status Code : " + res.statusCode);
                resp.statusCode = res.statusCode;
                resp.send("Error access : " + route + ", Status Code : " + res.statusCode);
                return ;
            }
            resp.statusCode = res.statusCode;
            resp.send(res.body);
            return ;
       });
});


module.exports = router;