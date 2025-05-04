import axios from 'axios';

const API_BASE_URL = 'https://chatverse-backend-9ymo.onrender.com'

const api = axios.create({
    baseURL: API_BASE_URL,
});

export default api;