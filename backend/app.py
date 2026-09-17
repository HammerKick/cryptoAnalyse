import os
import json
from datetime import datetime, timezone

import requests
from flask import Flask, jsonify
from flask_cors import CORS
from anthropic import Anthropic
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

client = Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

COINGECKO_BASE = "https://api.coingecko.com/api/v3"


def get_market_data(coin_id, vs_currency="eur"):
    """Récupère le prix actuel, la variation 24h et le volume."""
    response = requests.get(
        f"{COINGECKO_BASE}/coins/markets",
        params={"vs_currency": vs_currency, "ids": coin_id},
        timeout=10,
    )
    response.raise_for_status()
    data = response.json()
    if not data:
        raise ValueError(f"Cryptomonnaie inconnue : {coin_id}")
    return data[0]


def get_price_history(coin_id, vs_currency="eur", days=2):
    """Récupère l'historique de prix (~48h, granularité horaire)."""
    response = requests.get(
        f"{COINGECKO_BASE}/coins/{coin_id}/market_chart",
        params={"vs_currency": vs_currency, "days": days},
        timeout=10,
    )
    response.raise_for_status()
    prices = response.json()["prices"]
    step = max(1, len(prices) // 24)
    sampled = prices[::step]
    return [
        {
            "heure": datetime.fromtimestamp(ts / 1000, tz=timezone.utc).strftime("%Y-%m-%d %H:%M"),
            "prix": round(price, 2),
        }
        for ts, price in sampled
    ]


def build_prompt(market, history):
    historique_txt = "\n".join(f"- {p['heure']} UTC : {p['prix']} €" for p in history)
    return f"""Tu es un agent d'analyse de marché crypto. Analyse les données suivantes pour {market['name']} ({market['symbol'].upper()}) et produis une estimation de prix à 24h.

Données actuelles :
- Prix actuel : {market['current_price']} €
- Variation sur 24h : {market.get('price_change_percentage_24h')} %
- Volume d'échange 24h : {market.get('total_volume')} €

Historique récent des prix (dernières ~48h) :
{historique_txt}

Réponds UNIQUEMENT avec un objet JSON strict, sans texte autour, au format exact suivant :
{{
  "prix_min_24h": nombre,
  "prix_max_24h": nombre,
  "tendance": "hausse" | "baisse" | "stable",
  "explication": "texte court expliquant le raisonnement (3-4 phrases max)",
  "niveau_incertitude": "faible" | "moyen" | "élevé",
  "limites": "texte court rappelant les limites de l'analyse"
}}

Rappel : ceci est une estimation indicative basée sur des données historiques, ce n'est pas un conseil financier et l'évolution réelle peut différer fortement."""


@app.route("/api/predict/<coin_id>", methods=["GET"])
def predict(coin_id):
    try:
        market = get_market_data(coin_id)
        history = get_price_history(coin_id)
    except Exception as e:
        return jsonify({"error": f"Impossible de récupérer les données marché : {str(e)}"}), 502

    prompt = build_prompt(market, history)

    try:
        message = client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=500,
            messages=[{"role": "user", "content": prompt}],
        )
        raw_text = message.content[0].text.strip()
        raw_text = raw_text.removeprefix("```json").removeprefix("```").removesuffix("```").strip()
        analyse = json.loads(raw_text)
    except Exception as e:
        return jsonify({"error": f"Erreur de l'agent IA : {str(e)}"}), 502

    return jsonify({
        "coin": market["name"],
        "symbole": market["symbol"].upper(),
        "prix_actuel": market["current_price"],
        "analyse": analyse,
    })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)