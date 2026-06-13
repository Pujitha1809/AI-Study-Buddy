// API Base URL configuration
// In development, this will use the local Node server.
// In production on Render, it will use the deployed backend URL.
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
