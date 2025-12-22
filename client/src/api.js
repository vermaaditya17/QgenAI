// If we are live, use the backend URL. If local, use localhost.
const API_URL = import.meta.env.VITE_API_URL || "https://qgen-backend1.onrender.com";

export default API_URL;