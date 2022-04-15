[![GitHub license](https://img.shields.io/github/license/Naereen/StrapDown.js.svg)](./license.md)

# mini-api-gateway
Minimal Api Gateway very easy to use

# Settings
## Configuration
```
[
  {
    "apiName": "UsersApi",
    "apiUrl": "http://localhost:8080/users",
    "apiDescription": "Api to manage Users",
    "apiVersion": "0.0.1",
    "authenticationType": "api-key",
    "authenticationSecret": "TEST-SECRET-TO-GENERATE",
  }
]

```

You can declare as many APIs as you want.
Each API has its own access configuration, two types: token, api-key, generated or filled in by you (example when launching the docker container if you decide to embed this code in a docker).

Each API has routes, each route is characterized by the HTTP method, its path, its content type, whether or not it has a body... .

The routes of each api do not need to be configured, the gateway takes the headers, the body, the parameters from the client calling mini-api-gateway.

## Server parameters
you can change the server port by setting the environment variable: GATEWAY_PORT

# How to use

### token

Today two authentication : token (in query param of url) and by api-key (in the headers of the request)

```
curl --location --request GET 'http://localhost:3000?api=UsersApi&path=/&token=TEST-SECRET-TO-GENERATE'
```

### api-key
```
curl --location --request GET 'http://localhost:3000?api=UsersApi&path=/' \
--header 'api-key: TEST-SECRET-TO-GENERATE'
```

