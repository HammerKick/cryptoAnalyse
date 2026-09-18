# Crypto Analyse

INFO : FAIRE UN CRTL + SHIFT + V pour les tableaux et le formatage Markdown (si vous etes dans vs code)

Cette application mobile permet d'obtenir des informations sur la crypto de son choix et de demander à un agent IA intégré une prédiction de son évolution sur les prochaines 24 heures.

## Installation front-end

Cloner le projet et installer les dépendances :

```
git clone https://github.com/HammerKick/cryptoAnalyse.git
cd cryptoAnalyse
npm install
```

Sur le téléphone, installer l'app **Expo Go** (App Store / Google Play).

Lancer le projet :

```
npx expo start
```

Scanner le QR code affiché dans le terminal avec Expo Go (le téléphone doit être sur le même réseau Wi-Fi que l'ordinateur).

## Installation back-end

Le back-end est un serveur **Flask** (Python) qui fait le lien entre l'app et deux API externes : **CoinGecko** (données de marché) et **Claude/Anthropic** (agent IA d'estimation). Nécessaire pour ne pas exposer la clé API Claude dans l'app mobile.

### Prérequis

- Python 3.10+
- Une clé API Anthropic :
  1. Aller sur [console.anthropic.com](https://console.anthropic.com) et créer un compte (ou se connecter)
  2. Aller dans "API Keys" (menu de gauche) → "Create Key"
  3. Copier la clé générée (visible une seule fois, commence par `sk-ant-...`)
  4. Un petit crédit (quelques dollars) doit généralement être ajouté au compte avant que les appels API fonctionnent

### Installation

```
cd backend
python -m venv venv
```

Activer : `venv\Scripts\activate` (Windows) ou `source venv/bin/activate` (Mac/Linux)

```
pip install -r requirements.txt
python app.py
```

Créer un fichier `.env` dans `backend/` (non commit) :

```
ANTHROPIC_API_KEY=votre_cle_ici
```

Le serveur tourne sur le port `5000`. Dans `services/apiIA.js`, mettre l'IP locale de la machine qui fait tourner Flask (téléphone et PC sur le même Wi-Fi) :

```js
const BASE_URL = "http://VOTRE_IP_LOCALE:5000";
```

### Choix des données (CoinGecko)

| Endpoint                   | Données                            | Pourquoi                                             |
| -------------------------- | ---------------------------------- | ---------------------------------------------------- |
| `/coins/markets`           | Prix actuel, variation 24h, volume | Momentum immédiat                                    |
| `/coins/{id}/market_chart` | Historique ~48h (horaire)          | Détecte la tendance courte sans surcharger l'analyse |
