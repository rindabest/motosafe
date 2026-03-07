import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5275/api';

const apiAuth = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiAuth.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const handleApiError = (error) => {
    if (axios.isAxiosError(error)) {
        return error.response?.data?.message || error.message;
    }
    return 'An unexpected error occurred';
};

export default apiAuth;
