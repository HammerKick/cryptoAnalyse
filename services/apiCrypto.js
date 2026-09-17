import axios from "axios";


const BASE_URL="https://api.coingecko.com/api/v3/coins/markets";
const BASE_HISTORY ="https://api.coingecko.com/api/v3";
const params = {
    "vs_currency":"eur",
    "order":"market_cap_desc",
    "per_page":250,
    "sparkline":false,
    "page":1
}

const paramHistoric = {
    "vs_currency":"eur",
    "days":2
}

//récuperer les infos des cryptos
export async function getInfos(){
    try{
        const response = await axios(BASE_URL,{params})
        const data = response.data.map((item)=>{
            return {
            "logo":item.image,
            "price":item.current_price,
            "name":item.name,
            "volume":item.total_volume,
            "symbol":item.symbol,
            "id":item.id,
            "percent":item.price_change_percentage_24h,
            
        
        }

        });
        return data;

    }catch(e){
        console.log(e);

    }
}

//récupérer l'historique des prix (48h) pour le graphe
export async function getHistory(id){
    try{
        const response = await axios(`${BASE_HISTORY}/coins/${id}/market_chart`,{params:paramHistoric})
        const prices = response.data.prices;
        return prices.map(([timestamp,price])=>{
            const date = new Date(timestamp);
            return {
                "heure": date.getHours()+"h",
                "prix": price,
            }
        });
    }catch(e){
        console.log(e);
        return [];
    }
}