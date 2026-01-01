import axios, { InternalAxiosRequestConfig } from 'axios';

const api = axios.create({
    baseURL: '/api', // Relative path for Vercel Monorepo
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

export default api;
