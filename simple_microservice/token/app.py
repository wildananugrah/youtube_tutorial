from flask import Flask, request, jsonify
import json
import jwt
import datetime

app = Flask(__name__)
app.config["secret_key"] = "thisisoursecretkeybro!"

@app.route("/generate",methods=["POST"])
def generate():
    payload = json.loads(request.data)
    id = payload["id"]
    
    expired_at = datetime.datetime.utcnow() + datetime.timedelta(minutes=30)
    jwt_payload = jwt.encode(
        {"id":id, "exp": expired_at}, app.config["secret_key"]
    )

    return jsonify({
        "token":jwt_payload,
        "expired_at":expired_at
    }), 200

@app.route("/validate",methods=["POST"])
def validate():
    payload = json.loads(request.data)
    token = payload["token"]
    
    try:
        expired_at = datetime.datetime.utcnow() + datetime.timedelta(seconds=30)
        jwt_decoded = jwt.decode(token, app.config["secret_key"], algorithms=["HS256"])

        return jsonify({
            "id":jwt_decoded["id"]
        }), 200
    except Exception as err:
        return jsonify({ "message" : "un-authorized" }), 401

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=7010, debug=True)