from flask import Flask, request, jsonify
import requests
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

RAPIDAPI_KEY = "a6fa90a91fmsh4d4144514985144p190fbdjsna4a68cc70af6"
API_URL = "https://commodity-rates-api.p.rapidapi.com/open-high-low-close/"

@app.route("/fetch-prices", methods=["GET"])
def fetch_prices():
    product = request.args.get("product")

    if not product:
        return jsonify({"error": "Please provide a product"}), 400

    try:
        headers = {
            "x-rapidapi-host": "commodity-rates-api.p.rapidapi.com",
            "x-rapidapi-key": RAPIDAPI_KEY
        }
        params = {"base": "USD", "symbols": product}

        response = requests.get(API_URL, headers=headers, params=params)
        
        print("Response Status:", response.status_code)
        print("Response Text:", response.text)  # Debugging output

        if response.status_code != 200:
            return jsonify({"error": "Failed to fetch data from external API"}), 500

        data = response.json()
        return jsonify({"product": product, "prices": data})

    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
