import { useState } from 'react'
import { BookOpen, Brain, Target, Users } from 'lucide-react'

export default function HomePage() {
  const [text, setText] = useState('')
  const [generatedContent, setGeneratedContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleGenerate = async () => {
    if (!text.trim()) return
    
    setIsLoading(true)
    try {
      // AI 텍스트 생성 로직 (추후 구현)
      setTimeout(() => {
        setGeneratedContent(`생성된 교육 콘텐츠: ${text}에 대한 상세한 설명과 예시들...`)
        setIsLoading(false)
      }, 2000)
    } catch (error) {
      console.error('생성 실패:', error)
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-indigo-600" />
              <h1 className="ml-2 text-2xl font-bold text-gray-900">EduText Pro</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-500 hover:text-gray-900">기능</a>
              <a href="#about" className="text-gray-500 hover:text-gray-900">소개</a>
              <a href="/admin/login" className="text-gray-500 hover:text-gray-900">관리자</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            AI로 만드는 <span className="text-indigo-600">스마트 교육</span>
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            인공지능 기술로 개인 맞춤형 교육 콘텐츠를 생성하세요
          </p>
        </div>

        {/* Text Generation Section */}
        <div className="mt-12 max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">교육 콘텐츠 생성</h3>
            <div className="space-y-4">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="생성하고 싶은 교육 주제나 내용을 입력하세요..."
                className="w-full h-32 p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
              <button
                onClick={handleGenerate}
                disabled={isLoading || !text.trim()}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? '생성 중...' : 'AI 콘텐츠 생성'}
              </button>
            </div>
            
            {generatedContent && (
              <div className="mt-6 p-4 bg-gray-50 rounded-md">
                <h4 className="font-medium text-gray-900 mb-2">생성된 콘텐츠:</h4>
                <p className="text-gray-700">{generatedContent}</p>
              </div>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="mt-20">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">주요 기능</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <Brain className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-900 mb-2">AI 기반 생성</h4>
              <p className="text-gray-600">최신 AI 기술로 고품질 교육 콘텐츠를 자동 생성합니다.</p>
            </div>
            <div className="text-center">
              <Target className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-900 mb-2">맞춤형 학습</h4>
              <p className="text-gray-600">개인의 학습 수준과 목표에 맞는 콘텐츠를 제공합니다.</p>
            </div>
            <div className="text-center">
              <Users className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-900 mb-2">협업 지원</h4>
              <p className="text-gray-600">교육자와 학습자 간의 효과적인 협업을 지원합니다.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500">
            <p>&copy; 2024 EduText Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}