import psycopg2
from flask import Flask, request, jsonify
import json

app = Flask(__name__)

@app.route("/register",methods=["POST"])
def register():
    try:
        payload = json.loads(request.data)
        email = payload["email"]
        password = payload["password"]

        connection = psycopg2.connect(host="pg",database="youtubedb",user="youtubeuser",password="youtubepass")
        cursor = connection.cursor()

        # email checking
        query = f"SELECT * FROM app_user WHERE email='{email}'"
        cursor.execute(query)

        if(cursor.rowcount == 1):
            cursor.close()
            connection.close()
            return jsonify({
                "message":"failed",
                "email": email
            }), 400
        
        query = f"INSERT INTO app_user(id, email, password) VALUES(uuid_generate_v4(), '{email}','{password}')"
        cursor.execute(query)
        connection.commit()

        cursor.close()
        connection.close()

        return jsonify({
            "message":"success",
            "email":email
        }), 200

    except Exception as err:
        print(f"ERROR: {err}")
        return jsonify({"message": f"ERROR: {err}"}), 500

@app.route("/login",methods=["POST"])
def login():
    try:
        payload = json.loads(request.data)
        email = payload["email"]
        password = payload["password"]

        connection = psycopg2.connect(host="pg",database="youtubedb",user="youtubeuser",password="youtubepass")
        cursor = connection.cursor()

        # email checking
        query = f"SELECT id FROM app_user WHERE email='{email}'"
        cursor.execute(query)

        if(cursor.rowcount == 0):
            cursor.close()
            connection.close()
            return jsonify({
                "message":"email doesnt exist!",
                "email": email
            }), 400
        
        row = cursor.fetchone()

        cursor.close()
        connection.close()

        return jsonify({
            "id":row[0]
        }), 200

    except Exception as err:
        print(f"ERROR: {err}")
        return jsonify({"message": f"ERROR: {err}"}), 500

@app.route("/list",methods=["GET"])
def list():
    try:

        connection = psycopg2.connect(host="pg",database="youtubedb",user="youtubeuser",password="youtubepass")
        cursor = connection.cursor()

        # email checking
        query = f"SELECT id, email FROM app_user"
        cursor.execute(query)
        
        rows = cursor.fetchall()

        data = []
        for row in rows:
            data.append({
                "id":row[0],
                "email":row[1]
            })

        cursor.close()
        connection.close()

        return jsonify({
            "message":"success",
            "data":data
        }), 200

    except Exception as err:
        print(f"ERROR: {err}")
        return jsonify({"message": f"ERROR: {err}"}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=7020, debug=True)