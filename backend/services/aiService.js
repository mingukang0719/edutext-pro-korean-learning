// AI 서비스 - Gemini와 Claude 선택형
import { GoogleGenerativeAI } from '@google/generative-ai'
import Anthropic from '@anthropic-ai/sdk'

class AIService {
  constructor() {
    // Google Gemini 설정
    this.gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    this.geminiModel = this.gemini.getGenerativeModel({ 
      model: 'gemini-1.5-pro',
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 4096,
      }
    })

    // Anthropic Claude 설정
    this.claude = new Anthropic({
      apiKey: process.env.CLAUDE_API_KEY
    })
  }

  async generateContent(request) {
    const {
      provider = 'gemini',
      contentType = 'vocabulary',
      difficulty = 'intermediate',
      targetAge = 'adult',
      prompt,
      userId
    } = request

    try {
      let result
      const enhancedPrompt = this.buildKoreanLearningPrompt(prompt, contentType, { difficulty, targetAge })

      if (provider === 'gemini') {
        result = await this.generateWithGemini(enhancedPrompt)
      } else if (provider === 'claude') {
        result = await this.generateWithClaude(enhancedPrompt)
      } else {
        throw new Error('지원하지 않는 AI 제공업체입니다.')
      }

      // 생성 로그 저장 (추후 구현)
      await this.logGeneration(userId, provider, prompt, result)

      return {
        success: true,
        content: result.content,
        provider: result.provider,
        timestamp: new Date().toISOString(),
        tokensUsed: result.tokensUsed
      }

    } catch (error) {
      console.error(`AI Generation Error (${provider}):`, error)
      throw new Error(`${provider} 콘텐츠 생성에 실패했습니다: ${error.message}`)
    }
  }

  async generateWithGemini(prompt) {
    try {
      const result = await this.geminiModel.generateContent(prompt)
      const response = await result.response
      const text = response.text()

      // JSON 파싱 시도
      let parsedContent
      try {
        parsedContent = JSON.parse(text)
      } catch (parseError) {
        // JSON 파싱 실패 시 텍스트를 구조화
        parsedContent = this.parseUnstructuredText(text)
      }

      return {
        content: parsedContent,
        provider: 'gemini',
        tokensUsed: this.estimateTokens(text)
      }

    } catch (error) {
      console.error('Gemini API Error:', error)
      throw new Error(`Gemini 생성 실패: ${error.message}`)
    }
  }

  async generateWithClaude(prompt) {
    try {
      const message = await this.claude.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4096,
        temperature: 0.7,
        messages: [{
          role: 'user',
          content: prompt
        }]
      })

      const text = message.content[0].text

      // JSON 파싱 시도
      let parsedContent
      try {
        parsedContent = JSON.parse(text)
      } catch (parseError) {
        parsedContent = this.parseUnstructuredText(text)
      }

      return {
        content: parsedContent,
        provider: 'claude',
        tokensUsed: message.usage?.output_tokens || this.estimateTokens(text)
      }

    } catch (error) {
      console.error('Claude API Error:', error)
      throw new Error(`Claude 생성 실패: ${error.message}`)
    }
  }

  buildKoreanLearningPrompt(userPrompt, contentType, options) {
    const basePrompts = {
      vocabulary: `한국어 어휘 학습 자료를 생성해주세요. 
새로운 단어들의 정의, 예문, 품사, 활용법을 포함해야 합니다.`,

      grammar: `한국어 문법 학습 자료를 생성해주세요.
문법 규칙의 명확한 설명, 다양한 예문, 주의사항을 포함해야 합니다.`,

      reading: `한국어 읽기 학습 자료를 생성해주세요.
적절한 길이의 읽기 지문과 이해 문제를 포함해야 합니다.`,

      quiz: `한국어 학습 퀴즈를 생성해주세요.
다양한 유형의 문제와 명확한 정답, 해설을 포함해야 합니다.`
    }

    const difficultyGuides = {
      beginner: '초급자용 (한글을 읽을 수 있고 기본 단어 500개 정도 아는 수준)',
      intermediate: '중급자용 (일상 대화가 가능하고 기본 문법을 아는 수준)',
      advanced: '고급자용 (복잡한 문장을 이해하고 뉘앙스를 구분할 수 있는 수준)'
    }

    const ageGuides = {
      child: '어린이용 (재미있고 쉬운 예시, 그림이나 게임 요소 포함)',
      teen: '청소년용 (학교생활, 친구 관계 등 관련 예시)',
      adult: '성인용 (직장생활, 사회생활 등 실용적 예시)',
      senior: '시니어용 (천천히, 자세히, 반복 설명 위주)'
    }

    return `${basePrompts[contentType] || basePrompts.vocabulary}

사용자 요청: "${userPrompt}"

설정:
- 난이도: ${options.difficulty} (${difficultyGuides[options.difficulty]})
- 대상 연령: ${options.targetAge} (${ageGuides[options.targetAge]})

다음 JSON 형식으로 정확히 응답해주세요:

{
  "title": "학습 자료 제목",
  "description": "학습 자료에 대한 간단한 설명",
  "mainContent": {
    "introduction": "도입부 설명",
    "keyPoints": [
      "핵심 포인트 1",
      "핵심 포인트 2",
      "핵심 포인트 3"
    ],
    "examples": [
      {
        "korean": "한국어 예문",
        "romanization": "로마자 표기 (초급자용일 때만)",
        "english": "영어 번역",
        "explanation": "설명"
      }
    ]
  },
  "exercises": [
    {
      "type": "multiple-choice",
      "question": "문제",
      "options": ["선택지1", "선택지2", "선택지3", "선택지4"],
      "correctAnswer": 0,
      "explanation": "정답 설명"
    }
  ],
  "additionalNotes": [
    "추가 학습 팁이나 주의사항"
  ]
}

중요: 반드시 유효한 JSON 형식으로만 응답하고, 추가 설명은 JSON 내부에 포함시켜주세요.`
  }

  parseUnstructuredText(text) {
    // 구조화되지 않은 텍스트를 기본 구조로 변환
    const lines = text.split('\n').filter(line => line.trim())
    
    return {
      title: lines[0] || '한국어 학습 자료',
      description: 'AI가 생성한 학습 자료입니다.',
      mainContent: {
        introduction: lines.slice(1, 3).join(' ') || '',
        keyPoints: lines.slice(3, 6) || [],
        examples: []
      },
      exercises: [],
      additionalNotes: lines.slice(6) || []
    }
  }

  estimateTokens(text) {
    // 한국어 토큰 추정 (대략적)
    return Math.ceil(text.length / 2.5)
  }

  async logGeneration(userId, provider, prompt, result) {
    // TODO: 데이터베이스에 생성 로그 저장
    console.log('Generation Log:', {
      userId,
      provider,
      promptLength: prompt.length,
      tokensUsed: result.tokensUsed,
      timestamp: new Date().toISOString()
    })
  }

  // AI 제공업체 상태 확인
  async checkProviderStatus() {
    const status = {
      gemini: { available: !!process.env.GEMINI_API_KEY },
      claude: { available: !!process.env.CLAUDE_API_KEY }
    }

    // 간단한 테스트 요청으로 실제 상태 확인 (선택적)
    try {
      if (status.gemini.available) {
        // Gemini 테스트는 비용이 발생할 수 있어서 키 존재만 확인
        status.gemini.lastCheck = new Date().toISOString()
      }
      
      if (status.claude.available) {
        // Claude 테스트도 마찬가지
        status.claude.lastCheck = new Date().toISOString()
      }
    } catch (error) {
      console.error('Provider status check failed:', error)
    }

    return status
  }
}

export default AIService