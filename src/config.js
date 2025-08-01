// API 설정 - 데모용 (모의 응답 사용)
const API_URL = 'demo' // 데모 모드

export const config = {
  apiUrl: API_URL,
  demo: true, // 데모 모드 활성화
  supabase: {
    url: 'https://xrjrddwrsasjifhghzfl.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhyanJkZHdyc2FzamlmaGdoemZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0MTg1NTIsImV4cCI6MjA2Nzk5NDU1Mn0.pAqrS-9NYXiUZ1lONXlDm8YK-c3zhZj2VIix0_Q36rw'
  }
}

export default config