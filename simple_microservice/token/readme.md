POST http://localhost:7010/generate

```json
request:
{
    "id":"e9698b37-601f-4d07-af1e-71b53476523f"
}
resppnse:
{
    "token":"string",
    "expired_at":"datetime"
}
```

POST http://localhost:7010/validate
request:
```json
{
    "token":"string"
}
response:
{
    "id":"e9698b37-601f-4d07-af1e-71b53476523f"
}
```