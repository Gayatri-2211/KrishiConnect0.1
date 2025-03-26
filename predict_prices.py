from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np

app = Flask(__name__)
CORS(app)

# Load dataset
df = pd.read_csv("updated_prices (1).csv", encoding="utf-8")

# Convert Date column to datetime format
df["Date"] = pd.to_datetime(df["Date"], errors="coerce")

# Drop rows with missing essential values
df.dropna(subset=["Product", "State", "Date", "Price"], inplace=True)

# Define units for products
unit_mapping = {
       "Apple": "kg",
    "Banana": "dozen",
    "Mango": "kg",
    "Orange": "dozen",
    "Pineapple": "piece",
    "Tomato": "kg",
    "Potato": "kg",
    "Onion": "kg",
    "Carrot": "kg",
    "Cabbage": "kg",
    "Wheat Seeds": "kg",
    "Corn Seeds": "kg",
    "Rice Seeds": "kg",
    "Sunflower Seeds": "kg",
    "Soybean Seeds": "kg",
    "Urea": "50 kg bag",
    "DAP": "50 kg bag",
    "Compost": "kg",
    "NPK": "50 kg bag",
    "Potash": "50 kg bag",
    "Tractor": "per unit",
    "Plow": "per unit",
    "Seeder": "per unit",
    "Harvester": "per unit",
    "Irrigation Pump": "per unit"
}

# Get unique states and products
available_states = df["State"].dropna().unique().tolist()
available_products = df["Product"].dropna().unique().tolist()

@app.route("/fetch-options", methods=["GET"])
def fetch_options():
    return jsonify({"states": available_states, "products": available_products})

@app.route("/fetch-prices", methods=["GET"])
def fetch_prices():
    product = request.args.get("product")
    state = request.args.get("state")

    if not product or not state:
        return jsonify({"error": "Please provide both product and state"}), 400

    filtered_df = df[(df["Product"] == product) & (df["State"] == state)]

    if filtered_df.empty:
        return jsonify({"error": "No data found for the selected product and state"}), 404

    unit = unit_mapping.get(product, "unit")  # Get unit or default to "unit"

    print(f"DEBUG: Product = {product}, Unit = {unit}")  # ✅ Print to check if it's correct

    prices = filtered_df[["Date", "Price"]].to_dict(orient="records")

    return jsonify({"product": product, "state": state, "unit": unit, "prices": prices})


@app.route("/predict", methods=["GET"])
def predict():
    product = request.args.get("product")
    state = request.args.get("state")

    filtered_df = df[(df["Product"] == product) & (df["State"] == state)]

    if filtered_df.empty:
        return jsonify({"error": "No data available for prediction"}), 400

    historical_prices = filtered_df["Price"].values
    unit = unit_mapping.get(product, "unit")

    if len(historical_prices) < 2:
        predicted_price = float(historical_prices[-1]) * 1.05
    else:
        predicted_price = np.mean(historical_prices[-5:]) * 1.03  # Moving average + 3% increase

    return jsonify({"predicted_price": round(predicted_price, 2), "unit": unit})

if __name__ == "__main__":
    app.run(debug=True)
