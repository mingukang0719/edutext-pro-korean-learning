// Frontend AI Service
import config from '../config.js'
import DemoService from './demoService.js'

class AIService {
  constructor() {
    this.baseURL = config.apiUrl
    this.demoService = new DemoService()
    this.isDemo = config.demo || config.apiUrl === 'demo'
  }

  async generateContent(request) {
    try {
      // 데모 모드인 경우 데모 서비스 사용
      if (this.isDemo) {
        console.log('🎯 데모 모드: 모의 AI 응답 사용')
        return await this.demoService.generateContent(
          request.provider || 'claude',
          request.contentType || 'reading',
          request.prompt,
          {
            targetAge: request.targetAge,
            difficulty: request.difficulty,
            contentLength: request.contentLength
          }
        )
      }

      const response = await fetch(`${this.baseURL}/api/ai/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || 'AI 생성에 실패했습니다.')
      }

      return data

    } catch (error) {
      console.error('AI Service Error:', error)
      throw error
    }
  }

  async getProviderStatus() {
    try {
      const response = await fetch(`${this.baseURL}/api/ai/status`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data.status

    } catch (error) {
      console.error('AI Status Error:', error)
      return null
    }
  }

  // 콘텐츠 생성 헬퍼 메서드들
  async generateVocabulary(prompt, options = {}) {
    return this.generateContent({
      contentType: 'vocabulary',
      prompt,
      ...options
    })
  }

  async generateGrammar(prompt, options = {}) {
    return this.generateContent({
      contentType: 'grammar',
      prompt,
      ...options
    })
  }

  async generateReading(prompt, options = {}) {
    return this.generateContent({
      contentType: 'reading',
      prompt,
      ...options
    })
  }

  async generateQuiz(prompt, options = {}) {
    return this.generateContent({
      contentType: 'quiz',
      prompt,
      ...options
    })
  }

  // 콘텐츠 타입별 샘플 프롬프트
  getSamplePrompts() {
    return {
      vocabulary: [
        "한국어 인사말에 대한 어휘 학습 자료를 만들어주세요",
        "음식 관련 한국어 단어들을 정리해주세요", 
        "한국의 전통 문화 관련 어휘를 학습할 수 있는 자료를 만들어주세요"
      ],
      grammar: [
        "한국어 존댓말과 반말의 차이를 설명해주세요",
        "한국어 조사 '은/는'과 '이/가'의 사용법을 알려주세요",
        "한국어 시제 표현에 대해 설명해주세요"
      ],
      reading: [
        "한국의 사계절에 대한 읽기 자료를 만들어주세요",
        "한국의 전통 음식 소개 글을 작성해주세요",
        "한국 대학생의 일상생활에 대한 글을 써주세요"
      ],
      quiz: [
        "한국어 기초 어휘 퀴즈를 만들어주세요",
        "한국 문화에 대한 이해도를 확인하는 퀴즈를 만들어주세요",
        "한국어 문법 실력을 테스트하는 문제를 만들어주세요"
      ]
    }
  }

  // 난이도별 안내
  getDifficultyGuide() {
    return {
      beginner: {
        label: '초급',
        description: '한글을 읽을 수 있고 기본 단어 500개 정도 아는 수준',
        features: ['로마자 표기 포함', '쉬운 어휘 사용', '단순한 문장 구조']
      },
      intermediate: {
        label: '중급', 
        description: '일상 대화가 가능하고 기본 문법을 아는 수준',
        features: ['실용적인 표현', '다양한 문법 활용', '문화적 맥락 포함']
      },
      advanced: {
        label: '고급',
        description: '복잡한 문장을 이해하고 뉘앙스를 구분할 수 있는 수준', 
        features: ['고급 어휘', '복잡한 문법', '추상적 개념']
      }
    }
  }

  // 대상 연령별 안내
  getAgeGuide() {
    return {
      child: {
        label: '어린이',
        description: '재미있고 쉬운 예시, 그림이나 게임 요소 포함',
        features: ['놀이 중심', '시각적 요소', '반복 학습']
      },
      teen: {
        label: '청소년',
        description: '학교생활, 친구 관계 등 관련 예시',
        features: ['학급 친화적', '또래 문화', '실용적 회화']
      },
      adult: {
        label: '성인',
        description: '직장생활, 사회생활 등 실용적 예시',
        features: ['비즈니스 한국어', '공식적 표현', '사회 문화']
      },
      senior: {
        label: '시니어',
        description: '천천히, 자세히, 반복 설명 위주',
        features: ['체계적 설명', '충분한 연습', '반복 강화']
      }
    }
  }
}

export default new AIService()