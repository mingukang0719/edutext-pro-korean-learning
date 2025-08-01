// API 설정
const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://edutext-pro-api-2025.onrender.com'
  : 'http://localhost:3001'

export const config = {
  apiUrl: API_URL
}

export default config