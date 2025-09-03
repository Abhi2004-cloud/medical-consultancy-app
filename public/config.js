// Configuration for API endpoints
// This will automatically detect if we're running locally or deployed
const API_BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000' 
    : window.location.origin;

console.log('API Base URL:', API_BASE_URL);
