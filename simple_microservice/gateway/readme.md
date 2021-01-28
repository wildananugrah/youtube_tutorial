POST http://localhost:7000/register
```json
request:
{
    "email":"test@gmail.com",
    "password":"password"
}

response:
{
    "message":"Success",
    "data": {
        "email":"test@gmail.com"
    }
}
error:
{
    "message":"email has been registered",
    "data": {
        "email":"test@gmail.com"
    }   
}
```

POST http://localhost:7000/login
```json
request:
{
    "email":"test@gmail.com",
    "password":"password"
}

response:
{
    "message":"success",
    "data": {
        "token":"string"
    }
}
error:
{
    "message":"email is not registered please check",
    "data": {
        "email":"test@gmail.com"
    }   
}
```

GET http://localhost:7000/list
```json

response:
{
    "message":"success",
    "data": [
        {"id": "string", "email":"string" },
        {"id": "string", "email":"string" },
        {"id": "string", "email":"string" },
        {"id": "string", "email":"string" }
    ]
}
error:
{
    "message":"please re-login un-authorized"
}
```