import axios from 'axios';

console.log('VITE_API_BASE:', import.meta.env.VITE_API_BASE);

export const api = axios.create({ 
  baseURL: import.meta.env.VITE_API_BASE, 
  withCredentials: true 
});

let accessToken = null;
export const setAccessToken = (t) => {
  console.log('Setting access token:', !!t);
  accessToken = t;
};

api.interceptors.request.use((config) => {
  console.log('Making request to:', config.baseURL + config.url);
  console.log('Access token available:', !!accessToken);
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
    console.log('Authorization header set');
  } else {
    console.log('No access token available');
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log('Response received:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('Request failed:', error.message);
    console.error('Error response:', error.response?.data);
    return Promise.reject(error);
  }
);