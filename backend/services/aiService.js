// AI 서비스 - Gemini와 Claude 선택형
import { GoogleGenerativeAI } from '@google/generative-ai'
import Anthropic from '@anthropic-ai/sdk'
import dotenv from 'dotenv'

// 환경변수 로드
dotenv.config()

class AIService {
  constructor() {
    console.log('AIService constructor - Environment check:', {
      hasClaudeKey: !!process.env.CLAUDE_API_KEY,
      claudeKeyPrefix: process.env.CLAUDE_API_KEY?.substring(0, 10),
      hasGeminiKey: !!process.env.GEMINI_API_KEY
    })
    
    // Google Gemini 설정
    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here') {
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
    }

    // Anthropic Claude 설정
    if (process.env.CLAUDE_API_KEY && process.env.CLAUDE_API_KEY !== 'your_claude_api_key_here') {
      this.claude = new Anthropic({
        apiKey: process.env.CLAUDE_API_KEY
      })
    }
  }

  async generateContent(request) {
    const {
      provider = 'gemini',
      contentType = 'reading',
      difficulty = 'intermediate',
      targetAge = 'elem1',
      contentLength = '400',
      prompt,
      userId
    } = request

    try {
      let result
      const enhancedPrompt = this.buildKoreanLearningPrompt(prompt, contentType, { difficulty, targetAge, contentLength })

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
      // API 키가 없거나 테스트 키인 경우 또는 클라이언트가 초기화되지 않은 경우 모의 응답 제공
      if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here' || !this.gemini) {
        return this.getMockResponse('gemini', prompt)
      }

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
      // API 키가 없거나 테스트 키인 경우 또는 클라이언트가 초기화되지 않은 경우 모의 응답 제공
      if (!process.env.CLAUDE_API_KEY || process.env.CLAUDE_API_KEY === 'your_claude_api_key_here' || !this.claude) {
        return this.getMockResponse('claude', prompt)
      }

      const message = await this.claude.messages.create({
        model: 'claude-3-sonnet-20240229',
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
      vocabulary: `지문에서 어려운 어휘를 추출하고 분석해주세요. 
각 어휘의 의미, 유의어, 반의어, 난이도를 포함해야 합니다.`,

      grammar: `한국어 문법 학습 자료를 생성해주세요.
문법 규칙의 명확한 설명, 다양한 예문, 주의사항을 포함해야 합니다.`,

      reading: `한국어 읽기 지문을 생성해주세요.
해당 연령과 수준에 맞는 지문을 정확한 글자 수로 작성해야 합니다.`,

      questions: `지문 기반 서술형 문제를 생성해주세요.
맥락 추론형과 내용 이해형 문제를 포함해야 합니다.`,

      answers: `문제에 대한 상세한 해설을 작성해주세요.
정답, 해설, 채점 기준, 학습 팁을 포함해야 합니다.`,

      quiz: `한국어 학습 퀴즈를 생성해주세요.
다양한 유형의 문제와 명확한 정답, 해설을 포함해야 합니다.`
    }

    const difficultyGuides = {
      beginner: '초급자용 (한글을 읽을 수 있고 기본 단어 500개 정도 아는 수준)',
      intermediate: '중급자용 (일상 대화가 가능하고 기본 문법을 아는 수준)',
      advanced: '고급자용 (복잡한 문장을 이해하고 뉘앙스를 구분할 수 있는 수준)'
    }

    const ageGuides = {
      elem1: '초등학교 1학년 (7세)',
      elem2: '초등학교 2학년 (8세)', 
      elem3: '초등학교 3학년 (9세)',
      elem4: '초등학교 4학년 (10세)',
      elem5: '초등학교 5학년 (11세)',
      elem6: '초등학교 6학년 (12세)',
      middle1: '중학교 1학년 (13세)',
      middle2: '중학교 2학년 (14세)',
      middle3: '중학교 3학년 (15세)',
      high1: '고등학교 1학년 (16세)',
      high2: '고등학교 2학년 (17세)',
      high3: '고등학교 3학년 (18세)'
    }

    return `${basePrompts[contentType] || basePrompts.vocabulary}

사용자 요청: "${userPrompt}"

설정:
- 난이도: ${options.difficulty} (${difficultyGuides[options.difficulty]})
- 대상 연령: ${options.targetAge} (${ageGuides[options.targetAge]})
- 글자 수: 정확히 ${options.contentLength}자

${contentType === 'reading' ? `**중요**: 지문은 반드시 ${options.contentLength}자로 작성해주세요. 해당 학년 수준에 맞는 어휘와 문체를 사용하여 학생이 이해할 수 있는 내용으로 만들어주세요.` : ''}

다음 JSON 형식으로 정확히 응답해주세요:

${this.getJsonFormat(contentType)}

중요: 반드시 유효한 JSON 형식으로만 응답하고, 추가 설명은 JSON 내부에 포함시켜주세요.`
  }

  getJsonFormat(contentType) {
    switch (contentType) {
      case 'vocabulary':
        return `{
  "title": "어휘 분석 결과",
  "vocabularyList": [
    {
      "word": "어휘",
      "meaning": "한자어 기반 쉬운 풀이",
      "synonyms": ["유의어1", "유의어2"],
      "antonyms": ["반의어1", "반의어2"],
      "difficulty": "★★★★☆",
      "example": "예문"
    }
  ]
}`

      case 'questions':
        return `{
  "title": "서술형 문제",
  "questions": [
    {
      "type": "맥락 추론형",
      "question": "문제 내용",
      "answerSpace": 3,
      "points": 10
    },
    {
      "type": "내용 이해형", 
      "question": "문제 내용",
      "answerSpace": 4,
      "points": 10
    }
  ]
}`

      case 'answers':
        return `{
  "title": "문제 해설",
  "answers": [
    {
      "questionNumber": 1,
      "correctAnswer": "예시 정답",
      "explanation": "상세한 해설",
      "gradingCriteria": ["채점 기준 1", "채점 기준 2"],
      "tips": "학습 팁"
    }
  ]
}`

      default:
        return `{
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
}`
    }
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

  // 모의 응답 생성 (API 키가 없을 때 사용)
  getMockResponse(provider, prompt) {
    const isReading = prompt.includes('읽기 지문') || prompt.includes('지문을')
    const isVocabulary = prompt.includes('어휘') || prompt.includes('vocabulary')
    const isQuestions = prompt.includes('문제') || prompt.includes('questions')
    const isAnswers = prompt.includes('해설') || prompt.includes('answers')

    let mockContent

    if (isReading) {
      mockContent = {
        title: "봄에 피는 꽃들",
        description: "초등학교 1학년을 위한 봄 꽃 이야기",
        mainContent: {
          introduction: "따뜻한 봄이 오면 여러 가지 예쁜 꽃들이 피어납니다. 개나리는 노란색으로 먼저 피고, 진달래는 분홍색으로 예쁘게 핍니다. 벚꽃은 하얀색과 분홍색으로 피어서 마치 눈이 내린 것 같아요. 꽃들은 우리에게 봄이 왔다고 알려주는 친구들입니다. 꽃들을 보면 마음이 기뻐집니다. 우리는 꽃을 소중히 여겨야 해요. 꽃을 꺾지 말고 예쁘게 구경만 해야 합니다. 꽃들도 우리처럼 살아있는 생명이기 때문입니다. 봄에는 가족과 함께 꽃구경을 가면 좋겠어요. 공원이나 산에 가서 여러 가지 꽃들을 찾아보세요. 꽃의 색깔과 모양을 자세히 관찰해보면 정말 신기합니다. 자연은 우리에게 아름다운 선물을 주는 것 같아요.",
          keyPoints: [
            "봄에는 여러 가지 꽃들이 핀다",
            "꽃마다 색깔과 모양이 다르다", 
            "꽃은 생명이므로 소중히 여겨야 한다"
          ],
          examples: [
            {
              korean: "개나리가 노랗게 피었어요.",
              explanation: "봄에 가장 먼저 피는 노란 꽃"
            }
          ]
        }
      }
    } else if (isVocabulary) {
      mockContent = {
        title: "어휘 분석 결과",
        vocabularyList: [
          {
            word: "관찰",
            meaning: "자세히 살펴보는 것",
            synonyms: ["구경", "살피기"],
            antonyms: ["무시", "소홀"],
            difficulty: "★★★☆☆",
            example: "꽃을 관찰해보세요."
          },
          {
            word: "생명",
            meaning: "살아있는 것",
            synonyms: ["목숨", "삶"],
            antonyms: ["죽음"],
            difficulty: "★★☆☆☆", 
            example: "꽃도 생명이에요."
          }
        ]
      }
    } else if (isQuestions) {
      mockContent = {
        title: "서술형 문제",
        questions: [
          {
            type: "내용 이해형",
            question: "봄에 피는 꽃의 종류를 3가지 써보세요.",
            answerSpace: 3,
            points: 10
          },
          {
            type: "맥락 추론형", 
            question: "글쓴이가 꽃을 꺾지 말라고 하는 이유를 써보세요.",
            answerSpace: 4,
            points: 15
          }
        ]
      }
    } else if (isAnswers) {
      mockContent = {
        title: "문제 해설",
        answers: [
          {
            questionNumber: 1,
            correctAnswer: "개나리, 진달래, 벚꽃",
            explanation: "지문에서 봄에 피는 꽃으로 개나리(노란색), 진달래(분홍색), 벚꽃(하얀색, 분홍색)을 제시했습니다.",
            gradingCriteria: ["3가지 꽃 이름 정확히 쓰기", "맞춤법 정확성"],
            tips: "지문을 차근차근 읽으며 꽃 이름을 찾아보세요."
          }
        ]
      }
    }

    return {
      content: mockContent,
      provider: provider,
      tokensUsed: 100
    }
  }
}

export default AIService