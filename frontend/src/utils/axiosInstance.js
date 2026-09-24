
import axios from 'axios';
import { BASE_URL } from './apiPaths';


const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 60000, // 60 seconds timeout to accommodate AI generative responses & file uploads
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});




// Request interceptor to add token to headers
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('token');
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
    }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)





// Response interceptor to handle errors globally
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    }, 
    (error) => {
        if (error.response) {
            if(error.response.status === 401) {
                window.location.href = '/';
        }
        else if (error.response.status === 500) {
            console.error('Server error')
        }
    }
    else if (error.code === 'ECONNABORTED') {
            console.error('Request timed out');
        }
        return Promise.reject(error);
    }   
)



export default axiosInstance;




