// API 설정
const getApiUrl = () => {
  // 프로덕션 환경에서는 Render 백엔드 URL 사용
  if (process.env.NODE_ENV === 'production') {
    return 'https://edutext-pro-backend.onrender.com'
  }
  
  // 개발 환경에서는 로컬 백엔드 사용
  return 'http://localhost:3001'
}

export const API_BASE_URL = getApiUrl()

// API 엔드포인트 헬퍼
export const apiEndpoints = {
  // Admin endpoints
  adminLogin: `${API_BASE_URL}/api/admin/login`,
  adminStats: `${API_BASE_URL}/api/admin/stats`,
  adminTemplates: `${API_BASE_URL}/api/admin/templates`,
  
  // AI Generation endpoints
  generateFromTemplate: `${API_BASE_URL}/api/ai/generate-from-template`,
  generateDirect: `${API_BASE_URL}/api/ai/generate-direct`,
  generateBatch: `${API_BASE_URL}/api/ai/generate-batch`,
  generationHistory: `${API_BASE_URL}/api/ai/history`,
  
  // Health check
  health: `${API_BASE_URL}/api/health`
}

// Fetch 헬퍼 함수
export const apiFetch = async (url, options = {}) => {
  const token = localStorage.getItem('adminToken')
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  }
  
  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers
    }
  }
  
  return fetch(url, mergedOptions)
}