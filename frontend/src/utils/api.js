import axios from 'axios';

const API_BASE_URL = 'https://chatverse-1-i4ew.onrender.com'

const api = axios.create({
    baseURL: API_BASE_URL,
});

export default api;