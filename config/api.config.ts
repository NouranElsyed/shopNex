import axios from "axios";

export const api = axios.create({
    baseURL:"https://ecommerce.routemisr.com/api/v1",
    timeout: 5000
})