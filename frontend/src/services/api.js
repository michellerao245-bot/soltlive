import axios from 'axios';

// Apne backend ka live URL ya local URL yahan dalein
const API_BASE_URL = 'https://ecobackend.vercel.app'; // Ya localhost ke liye: 'http://localhost:5000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;