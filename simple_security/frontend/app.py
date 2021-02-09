import base64
import jwt

def encodeToBase64(message):
        base64_bytes = base64.b64encode(message)
        return base64_bytes

def decodeFromBase64(base64_message):
    message_bytes = base64.b64decode(base64_message)
    return message_bytes

private_key = open('keys/clientPrivateKey.key',mode='r').read()

payload = {
    "username": "wildan2update",
    "roleAccess": [
        { "users":["GET", "POST","PUT"] }
    ]
}

jwt_encoded = jwt.encode(payload, private_key, algorithm="RS256")

print(f"signature: {encodeToBase64(str.encode(jwt_encoded)).decode('utf-8')}")