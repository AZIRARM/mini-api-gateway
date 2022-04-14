# mini-api-gateway
Minimal Api Gateway very easy to use

# Description
## Presentation
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

## How to use

### token
```
curl --location --request GET 'http://localhost:3000?api=MarketUsersApi&path=/&token=TEST-SECRET-TO-GENERATE'
```

### api-key
```
curl --location --request GET 'http://localhost:3000?api=UsersApi&path=/' \
--header 'api-key: TEST-SECRET-TO-GENERATE'
```



# Licence
MIT License

Copyright (c) %%current_date_yyyy%% ITExpert

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.