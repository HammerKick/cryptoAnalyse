import axios from "axios";

const BASE_URL = "http://172.20.10.3:5000";

export async function getEstimation(id){
    const response = await axios.get(`${BASE_URL}/api/predict/${id}`);
    return response.data;
}