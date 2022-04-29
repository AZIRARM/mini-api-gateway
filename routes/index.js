const express = require('express');
const router = express.Router();

const request = require('request');

const fs = require('fs');

let jsonContent = fs.readFileSync('confs/settings.json');
let settings = JSON.parse(jsonContent);

console.log(settings);


const checkAuthorization = (req,res, next) => {
        let authorizationKey =   req.header('Authorization');

         console.debug("Authorization: "+authorizationKey);
         if(authorizationKey && authorizationKey === process.env.SECRETS_API_TOKEN) {
             console.debug("Authorization success for : "+req.path);
             next();
         } else {
             console.error("Authorization failed for : "+req.path);
             res.statusCode = 403;
             res.send("Authorization failed");
         }
}

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


/****************************
*     Statics Pages         *
*****************************/
router.get('/manage-apis', function(req,res){
    res.redirect("/manage-apis/index.html");
    return ;
});



/****************************
*            Apis           *
*****************************/
router.get('/manage-apis/apis', checkAuthorization, function(req,res){
    res.statusCode = 200;
    res.send(readConfiguration().map(api => {
        console.debug("-->"+api.apiName)
        return api.apiName;
        }
    ));
    return ;
});
router.get('/manage-apis/apis/:apiName', checkAuthorization, function(req,res){
    var apiName = req.params['apiName'];

    console.debug("Get api by name : "+apiName );

    res.statusCode = 200;
    res.send(readConfiguration().filter(api=>api.apiName === apiName).map(api => api));
    return ;
});
router.post('/manage-apis/apis', checkAuthorization, function(req,res){
    console.debug("Save new api :"+JSON.stringify(req.body) );

    var configuration = readConfiguration();

    var api = configuration.filter(api => api.apiName === req.body.apiName );

    if(api && api !== null && api.length > 0) {
        res.statusCode = 409;
        res.send( "Api already exist" );
    } else {
        console.log( "Process saving new api : " + req.body.apiName);
        configuration.push({
            "apiName":req.body.apiName,
            "apiUrl":req.body.apiUrl,
            "apiDescription":req.body.apiDescription,
            "apiVersion":req.body.apiVersion,
            "authenticationType":req.body.authenticationType,
            "authenticationSecret":req.body.authenticationSecret
        });

        this.writConfiguration(configuration);

        res.statusCode = 200;
        res.json( req.body.apiName );
    }
    return ;
});
router.put('/manage-apis/apis/:apiName', checkAuthorization, function(req,res){
    var apiName = req.params['apiName'];

    console.debug("Save Api : "+apiName+", content :"+JSON.stringify(req.body) );

    var configuration = readConfiguration();

    return configuration.filter(api => api.apiName === apiName ).map(api => {
        api.apiName = req.body.apiName;
        api.apiUrl = req.body.apiUrl;
        api.apiDescription = req.body.apiDescription;
        api.apiVersion = req.body.apiVersion;
        api.authenticationType = req.body.authenticationType;
        api.authenticationSecret = req.body.authenticationSecret;

        this.writConfiguration(configuration);
        res.statusCode = 200;
        res.json( req.body.apiName );

    });
    return ;
});
router.delete('/manage-apis/apis/:apiName', checkAuthorization, function(req,res){
    var apiName = req.params['apiName'];

    console.debug("Remove Api by name : "+apiName );

    res.statusCode = 200;
    let configuration = readConfiguration();
    let apis = configuration.filter(api=>api.apiName !== apiName);
    this.writConfiguration(apis);
    res.json(apiName);
    return ;
});



/****************************
*           Commons         *
*****************************/
writConfiguration = ((data) => {
    fs.writeFileSync('confs/settings.json', JSON.stringify(data,null, 2));
});

readConfiguration = (() => {
    let jsonContent = fs.readFileSync('confs/settings.json');
    let settings = JSON.parse(jsonContent);

    console.debug(settings);

    return settings;
});



module.exports = router;