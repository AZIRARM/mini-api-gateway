const express = require('express');
const router = express.Router();

const request = require('request');

const fs = require('fs');

let jsonContent = fs.readFileSync('confs/settings.json');
let settings = JSON.parse(jsonContent);

console.log(settings);


router.all('/', (req, resp) => {

    let api = req.query.api;

    settings.filter(setting => setting.apiName ===  api).map(
        setting => {
            console.log("Api name : "+ setting.apiName);
            console.log("Api url : "+ setting.apiUrl);
            console.log("Api description: "+ setting.apiDescription);
            console.log("Api version : "+ setting.apiVersion);
            console.log("Api authentication type: "+ setting.authenticatioType);

            let path = req.query.path;
            setting.routes.filter(route => route.path == path).map (
                route => {
                    console.log("--> Path  : "+ route.path);
                    console.log("--> Method  : "+ route.method);
                    console.log("--> Description  : "+ route.description);
                    console.log("--> Accept  : "+ route.accept);
                    console.log("--> Content type  : "+ route.contentType);
                    console.log("--> With body  : "+ route.withBody);
                    console.log("--> Request example  : "+ route.requestExample);
                    console.log("--> Response example  : "+ route.responseExample);

                let authenticationSuccess = false;
                 if(setting.authenticationType === 'token') {
                    let token = req.query.token;
                    console.error("Token : "+token);

                    if(!token || token !== setting.authenticationSecret) {
                            console.error("You do not have the necessary permissions to access this resource");

                            resp.statusCode = 401;
                            resp.send("You do not have the necessary permissions to access this resource");
                            return ;
                    }
                    authenticationSuccess = true;
                 }
                 if(setting.authenticationType === 'api-key') {
                     let apikey = req.header('api-key')
                     console.error("api-key : "+apikey);

                     if(!apikey || apikey !== setting.authenticationSecret) {
                             console.error("You do not have the necessary permissions to access this resource");

                             resp.statusCode = 401;
                             resp.send("You do not have the necessary permissions to access this resource");
                             return ;
                     }
                    authenticationSuccess = true;
                  }

                  if(authenticationSuccess) {
                    startRequest(req, resp, setting, route);
                  } else {
                    resp.statusCode = 500;
                    resp.send("An error in your configuration is present, please check the configuration file before continuing");
                    return ;
                  }


                }
            );
        }
    );

} );

startRequest = function (req, resp, setting, route) {
    console.log("----> Call route "+setting.apiUrl + route.path+", Method : "+route.method);

    request({
         headers: {
           'Accept': route.accept,
           'Content-Type': route.contentType
         },
         uri: setting.apiUrl + route.path,
         body: route.withBody ? req.body : null,
         method: route.method
       }, function (err, res, body) {
            if (err) {
                return console.log(err);
            }
            if(res.statusCode >= 400) {
                resp.statusCode = res.statusCode;
                resp.send("Error access : "+setting.apiUrl + route.path+", Status Code : "+res.statusCode);
            }
            resp.statusCode = res.statusCode;
            resp.send(res.body);
       });
}


module.exports = router;