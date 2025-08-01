import { Link } from 'react-router-dom'
import { FileText, Palette, Zap, Download, ArrowRight, Sparkles } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <h1 className="ml-3 text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                원바이트
              </h1>
              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                Print 모드
              </span>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">기능</a>
              <a href="#templates" className="text-gray-600 hover:text-gray-900 transition-colors">템플릿</a>
              <Link 
                to="/admin/login" 
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                관리자
              </Link>
              <Link
                to="/editor"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-200"
              >
                시작하기
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 rounded-full opacity-20 blur-3xl"></div>
        </div>

        <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              AI로 만드는
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                한국어 학습 자료
              </span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              A4 페이지에 최적화된 한국어 학습 자료를 AI로 생성하고,
              <br />
              드래그앤드롭으로 편집해서 PDF로 출력하세요
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link
                to="/editor"
                className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-xl transition-all duration-300 flex items-center"
              >
                지금 시작하기
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/templates"
                className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl text-lg font-semibold hover:border-blue-300 hover:text-blue-600 transition-all duration-300"
              >
                템플릿 둘러보기
              </Link>
            </div>

            {/* Demo Preview */}
            <div className="relative max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">A4 에디터 미리보기</h3>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-inner">
                    <div className="w-full h-48 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                      <div className="text-center">
                        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">A4 페이지 (210mm × 297mm)</p>
                        <p className="text-sm text-gray-400">드래그앤드롭으로 콘텐츠 배치</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="relative py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h3 className="text-4xl font-bold text-gray-900 mb-4">강력한 기능</h3>
              <p className="text-xl text-gray-600">한국어 학습 자료 제작에 특화된 도구들</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center group">
                <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-4 rounded-2xl w-16 h-16 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Sparkles className="h-8 w-8 text-blue-600 mx-auto" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">AI 콘텐츠 생성</h4>
                <p className="text-gray-600">Gemini와 Claude 중 선택하여 고품질 한국어 학습 콘텐츠를 생성</p>
              </div>
              
              <div className="text-center group">
                <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-4 rounded-2xl w-16 h-16 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Palette className="h-8 w-8 text-purple-600 mx-auto" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">A4 에디터</h4>
                <p className="text-gray-600">정확한 A4 크기에서 블록 기반 드래그앤드롭 편집</p>
              </div>
              
              <div className="text-center group">
                <div className="bg-gradient-to-br from-green-100 to-green-200 p-4 rounded-2xl w-16 h-16 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="h-8 w-8 text-green-600 mx-auto" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">실시간 미리보기</h4>
                <p className="text-gray-600">편집과 동시에 최종 결과물을 확인할 수 있는 WYSIWYG</p>
              </div>
              
              <div className="text-center group">
                <div className="bg-gradient-to-br from-orange-100 to-orange-200 p-4 rounded-2xl w-16 h-16 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Download className="h-8 w-8 text-orange-600 mx-auto" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">PDF 내보내기</h4>
                <p className="text-gray-600">인쇄 최적화된 고품질 PDF로 바로 내보내기</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-20 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h3 className="text-4xl font-bold text-white mb-6">
              지금 바로 시작해보세요
            </h3>
            <p className="text-xl text-blue-100 mb-8">
              무료로 한국어 학습 자료를 만들어보세요
            </p>
            <Link
              to="/editor"
              className="inline-flex items-center bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-xl transition-all duration-300 group"
            >
              에디터 열기
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <span className="ml-2 text-lg font-semibold">원바이트 Print 모드</span>
            </div>
            <div className="text-gray-400">
              <p>&copy; 2025 원바이트. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}