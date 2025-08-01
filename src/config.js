// API 설정
const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://edutext-pro-backend.onrender.com'
  : 'http://localhost:3001'

export const config = {
  apiUrl: API_URL,
  supabase: {
    url: process.env.NODE_ENV === 'production'
      ? 'https://xrjrddwrsasjifhghzfl.supabase.co'
      : 'https://xrjrddwrsasjifhghzfl.supabase.co',
    anonKey: process.env.NODE_ENV === 'production'
      ? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhyanJkZHdyc2FzamlmaGdoemZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0MTg1NTIsImV4cCI6MjA2Nzk5NDU1Mn0.pAqrS-9NYXiUZ1lONXlDm8YK-c3zhZj2VIix0_Q36rw'
      : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhyanJkZHdyc2FzamlmaGdoemZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0MTg1NTIsImV4cCI6MjA2Nzk5NDU1Mn0.pAqrS-9NYXiUZ1lONXlDm8YK-c3zhZj2VIix0_Q36rw'
  }
}

export default config