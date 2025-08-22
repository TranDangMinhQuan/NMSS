import axios from 'axios';

const api = axios.create({
    baseURL: 'https://api.example.com', // Replace with your API base URL
    headers: {
        'Content-Type': 'application/json',
        // Add any other headers you need here
    },
});

export default api;