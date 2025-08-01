import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { createClient } from '@supabase/supabase-js'

// Load environment variables
dotenv.config({ path: '../.env' })

const app = express()
const PORT = process.env.PORT || 3001

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

// Middleware
app.use(helmet())
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://edutext-pro.netlify.app'] 
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
})
app.use('/api/', limiter)

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  })
})

// Generate text endpoint (placeholder)
app.post('/api/generate', async (req, res) => {
  try {
    const { text, userId } = req.body

    if (!text) {
      return res.status(400).json({ error: 'Text is required' })
    }

    // TODO: Implement AI text generation
    const generatedContent = `생성된 교육 콘텐츠: ${text}에 대한 상세한 설명과 예시들...

주요 개념:
1. 기본 원리 설명
2. 실제 적용 사례
3. 연습 문제와 해답
4. 추가 학습 자료

이 내용은 AI가 생성한 샘플 콘텐츠입니다.`

    // Log generation (optional)
    if (userId) {
      await supabase
        .from('content_logs')
        .insert([
          {
            user_id: userId,
            original_text: text,
            generated_content: generatedContent,
            generated_at: new Date().toISOString()
          }
        ])
    }

    res.json({
      success: true,
      generatedContent,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Generation error:', error)
    res.status(500).json({ 
      error: 'Content generation failed',
      message: error.message 
    })
  }
})

// Admin login endpoint
app.post('/api/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body

    // Simple admin check (in production, use proper authentication)
    if (email === 'admin@inblanq.com' && password === '2025') {
      res.json({
        success: true,
        token: 'admin-token-placeholder',
        user: {
          email: 'admin@inblanq.com',
          role: 'admin'
        }
      })
    } else {
      res.status(401).json({ error: 'Invalid credentials' })
    }

  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Login failed' })
  }
})

// Admin stats endpoint
app.get('/api/admin/stats', async (req, res) => {
  try {
    // TODO: Get real stats from database
    const stats = {
      totalUsers: 1245,
      totalContent: 567,
      todayGenerated: 89,
      activeUsers: 234
    }

    res.json(stats)

  } catch (error) {
    console.error('Stats error:', error)
    res.status(500).json({ error: 'Failed to fetch stats' })
  }
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' })
})

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 EduText Pro Backend running on port ${PORT}`)
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`)
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`)
})