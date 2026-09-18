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
    response = requests.get(
        f"{COINGECKO_BASE}/coins/markets",
        params={
            "vs_currency": vs_currency,
            "ids": coin_id
        },
        timeout=10,
    )

    response.raise_for_status()
    data = response.json()

    if not data:
        raise ValueError(f"Cryptomonnaie inconnue : {coin_id}")

    return data[0]


def get_price_history(coin_id, vs_currency="eur", days=2):
    response = requests.get(
        f"{COINGECKO_BASE}/coins/{coin_id}/market_chart",
        params={
            "vs_currency": vs_currency,
            "days": days
        },
        timeout=10,
    )

    response.raise_for_status()

    prices = response.json()["prices"]
    step = max(1, len(prices) // 24)
    sampled = prices[::step]

    return [
        {
            "heure": datetime.fromtimestamp(
                ts / 1000,
                tz=timezone.utc
            ).strftime("%Y-%m-%d %H:%M"),
            "prix": round(price, 2),
        }
        for ts, price in sampled
    ]


def build_prompt(market, history):

    historique_txt = "\n".join(
        f"- {p['heure']} UTC : {p['prix']} €"
        for p in history
    )

    return f"""
Tu es un agent spécialisé dans l'analyse du marché des cryptomonnaies.

Tu dois analyser {market['name']} ({market['symbol'].upper()})
et produire une estimation indicative de son évolution
au cours des prochaines 24 heures.

Avant de produire ton analyse, effectue une recherche web.

Identifie uniquement les 3 actualités les plus importantes
publiées au cours des dernières 24 à 72 heures pouvant
influencer {market['name']} ou le marché des cryptomonnaies.

Recherche en priorité :

- les actualités concernant {market['name']} et le marché crypto
- l'inflation, la Fed, la BCE et les taux d'intérêt
- les guerres et tensions géopolitiques majeures
- la réglementation des cryptomonnaies

Ignore les actualités ayant peu ou pas d'impact potentiel
sur le marché.

Ne conserve que 3 actualités maximum.

Pour chaque actualité retenue, indique uniquement :

- le sujet
- la source
- la date
- l'impact : positif, négatif ou neutre
- une phrase courte expliquant son impact potentiel

Privilégie les sources reconnues et fiables.

N'invente jamais :
- une actualité
- une source
- une date
- une URL

Si une information n'est pas vérifiable, ne l'utilise pas.

Sois concis.
Ne fais pas d'introduction avant l'analyse.
Ne décris pas les recherches que tu vas effectuer.
Va directement aux résultats.

Données CoinGecko :

Cryptomonnaie :
{market['name']}

Symbole :
{market['symbol'].upper()}

Prix actuel :
{market['current_price']} €

Variation sur 24h :
{market.get('price_change_percentage_24h')} %

Volume d'échange sur 24h :
{market.get('total_volume')} €

Historique récent des prix (~48h) :

{historique_txt}

Combine :

- les données CoinGecko
- la tendance récente du prix
- la variation sur 24 heures
- le volume
- les actualités crypto
- les actualités économiques
- les événements géopolitiques

Pour chaque actualité importante identifiée :

- indique le titre ou le sujet
- indique la source
- indique la date
- explique son impact potentiel
- classe son impact comme positif, négatif ou neutre

Ne suppose jamais qu'une actualité est directement responsable
d'un mouvement de prix sans éléments suffisants.

Fais la différence entre corrélation et causalité.

À partir de toutes ces informations, donne :

- le prix minimum estimé dans les prochaines 24h
- le prix maximum estimé dans les prochaines 24h
- une tendance : hausse, baisse ou stable
- une explication de cette tendance
- les actualités les plus importantes
- les facteurs positifs
- les facteurs négatifs
- le niveau d'incertitude : faible, moyen ou élevé
- les limites de ton analyse

L'estimation doit rester prudente.

Ne présente jamais cette estimation comme une certitude.

Cette analyse est uniquement informative et
ne constitue pas un conseil financier.

Réponds UNIQUEMENT avec un objet JSON strict.
Ne mets aucun texte avant ou après le JSON.
N'utilise pas de bloc Markdown.

Respecte exactement cette structure :

{{
  "prix_min_24h": nombre,
  "prix_max_24h": nombre,
  "tendance": "hausse",
  "explication": "explication courte",
  "actualites": [
    {{
      "titre": "titre de l'actualité",
      "source": "nom de la source",
      "date": "date",
      "impact": "positif",
      "explication_impact": "explication courte"
    }}
  ],
  "facteurs_positifs": [
    "facteur positif"
  ],
  "facteurs_negatifs": [
    "facteur négatif"
  ],
  "niveau_incertitude": "moyen",
  "limites": "limites courtes de l'analyse"
}}

Pour "tendance", utilise uniquement :
"hausse", "baisse" ou "stable".

Pour "impact", utilise uniquement :
"positif", "negatif" ou "neutre".

Pour "niveau_incertitude", utilise uniquement :
"faible", "moyen" ou "élevé".

Ne retourne jamais plus de 3 actualités.
Garde les explications courtes afin de ne pas dépasser la limite de tokens.
"""


@app.route("/api/predict/<coin_id>", methods=["GET"])
def predict(coin_id):

    try:
        market = get_market_data(coin_id)
        history = get_price_history(coin_id)

    except Exception as e:
        print("ERREUR COINGECKO :", e)

        return jsonify({
            "error": f"Impossible de récupérer les données marché : {str(e)}"
        }), 502

    prompt = build_prompt(market, history)

    try:

        message = client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=1500,
            tools=[
                {
                    "type": "web_search_20250305",
                    "name": "web_search",
                    "max_uses": 3
                }
            ],
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],
        )

        print("REPONSE COMPLETE DE CLAUDE")
        print(message.content)

        raw_text = ""

        for block in message.content:
            if block.type == "text":
                raw_text += block.text

        print("TEXTE FINAL DE CLAUDE")
        print(raw_text)

        if not raw_text:
            raise ValueError("Claude n'a retourné aucun texte.")

        raw_text = raw_text.strip()
        raw_text = raw_text.removeprefix("```json")
        raw_text = raw_text.removeprefix("```")
        raw_text = raw_text.removesuffix("```")
        raw_text = raw_text.strip()

        analyse_json = json.loads(raw_text)

    except Exception as e:

        print("ERREUR CLAUDE :", e)

        return jsonify({
            "error": f"Erreur de l'agent IA : {str(e)}"
        }), 502

    return jsonify({
        "coin": market["name"],
        "symbole": market["symbol"].upper(),
        "prix_actuel": market["current_price"],
        "variation_24h": market.get("price_change_percentage_24h"),
        "volume_24h": market.get("total_volume"),
        "analyse": analyse_json
    })


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )