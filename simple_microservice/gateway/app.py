import requests
from flask import Flask, request, jsonify
import json
import datetime

app = Flask(__name__)
user_url = "http://user:7020"
token_url = "http://token:7010"

@app.route("/register",methods=["POST"])
def register():
    payload = json.loads(request.data)

    # hit service user
    data_payload = {
        "email" : payload["email"],
        "password": payload["password"]
    }
    response = requests.post(f"{user_url}/register", json=data_payload)
    
    # sent error response
    if(response.status_code != 200):
        return jsonify({
            "message":"email has been registered",
            "data": {
                "email":payload["email"]
            }   
        }), 400
    
    # sent ok response
    return jsonify({
        "message":"success",
        "data": {
            "email":payload["email"]
        }
    }), 200

@app.route("/login",methods=["POST"])
def login():
    payload = json.loads(request.data)

    # hit service user
    data_payload = {
        "email" : payload["email"],
        "password": payload["password"]
    }
    response = requests.post(f"{user_url}/login", json=data_payload)
    response_json = response.json()
    # sent error response
    if(response.status_code != 200):
        return jsonify({
            "message":"email is not registered please check",
            "data": {
                "email":payload["email"]
            }   
        }), 400
    data_payload = {
        "id" : response_json["id"]
    }

    response = requests.post(f"{token_url}/generate", json=data_payload)
    response_json = response.json()

    # sent ok reponse
    return jsonify({
        "message":"success",
        "data": {
            "token":response_json["token"],
            "expired_at":response_json["expired_at"]
        }
    }), 200

@app.route("/list", methods=["GET"])
def list():
    auth = request.headers['Authorization'].split(' ')
    token = auth[1]

    # hit validate token
    data_payload = {
        "token" : token
    }
    response = requests.post(f"{token_url}/validate", json=data_payload)

    if(response.status_code == 401):
        return jsonify({
            "message":"please re-login un-authorized"
        }), 401
    
    # hit get list users
    response = requests.get(f"{user_url}/list", json=data_payload)
    response_json = response.json()

    return jsonify({
        "message":"success",
        "data" : response_json["data"]
    }), 200
    
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=7000, debug=True)