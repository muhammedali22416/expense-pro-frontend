import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://expense-pro-backend.vercel.app',
});

export default instance;