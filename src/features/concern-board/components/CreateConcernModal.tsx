import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { ENDPOINTS } from '@/api/endpoints'
import CategoryBar from '@/common/components/CategoryBar'
import { useResponsiveStore } from '@/common/hooks/useResponsiveStore'
import { useAnonymousStore } from '@/features/auth/stores/useAnonymousStore'

const MODAL_STYLES = {
  width: 'w-[1200px]',
  height: 'h-[600px]',
  sectionSpacing: 'mb-6',
  logoSpacing: 'mb-10',
} as const

interface CreateConcernModalProps {
  isOpen: boolean
  onClose: () => void
  onCategoryChange: (category: string) => void
  selectedCategory: string
  onTitleChange: (title: string) => void
  onContentChange: (content: string) => void
  onCreateConcern: () => void
  title: string
  content: string
}

const categoryMap: Record<string, string> = {
  전체: 'ENTIRE',
  가족: 'FAMILY',
  연애: 'LOVE',
  진로: 'CAREER',
  정신건강: 'MENTAL',
  사회생활: 'SOCIETY',
  대인관계: 'PERSONAL',
}

const CreateConcernModal: React.FC<CreateConcernModalProps> = ({
  isOpen,
  onClose,
  onCategoryChange,
  selectedCategory,
  onTitleChange,
  onContentChange,
  onCreateConcern,
  title,
  content,
}) => {
  const { res } = useResponsiveStore()
  const { anonymous, toggleAnonymous, setAnonymous } = useAnonymousStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  if (!isOpen) return null

  const handleClose = () => {
    setAnonymous(false)
    setError(null)
    onClose()
  }

  const handleSubmit = async () => {
    if (loading) return
    if (!title.trim() || !content.trim() || !selectedCategory.trim()) {
      setError('제목, 내용, 카테고리를 모두 입력해주세요.')
      return
    }
    if (content.trim().length < 20) {
      setError('고민 내용은 최소 20자 이상이어야 합니다.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem('accessToken') // 또는 sessionStorage.getItem('accessToken');

      const response = await axios.post(
        ENDPOINTS.CONCERN_CREATE,
        {
          title,
          content,
          category: selectedCategory,
          anonymous,
        },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      )

      const category = categoryMap[selectedCategory]
      const boardId = response.data.boardId
      await axios.post(ENDPOINTS.ASSISTANT_ANSWER(boardId, category), {
        message: content,
      })

      onCreateConcern()
      handleClose()
      navigate('/night-sky/' + response.data.boardId)
    } catch {
      setError('게시글 생성 중 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className={`bg-white rounded-xl shadow-lg p-8 ${
          res === 'pc'
            ? `${MODAL_STYLES.width} ${MODAL_STYLES.height}`
            : 'w-[90%] h-[80vh]'
        } relative flex flex-col`}
      >
        <button
          onClick={handleClose}
          className="absolute top-3 right-6 text-4xl z-10"
        >
          &times;
        </button>

        <div className="flex-grow overflow-y-auto p-4 hide-scrollbar">
          {/* 로고 */}
          <div
            className={`flex items-center justify-center ${MODAL_STYLES.logoSpacing}`}
          >
            <img
              src="/images/MoonRabbitSleep2.png"
              alt="Moon Rabbit Logo"
              className="h-24 w-auto mr-4"
            />
            <div className="font-mainFont">
              <p className="text-xl text-gray-800">
                <span style={{ color: 'var(--color-lightCaramel)' }}>달</span>
                토끼
              </p>
              <p className="text-sm text-gray-600">
                <span style={{ color: 'var(--color-lightCaramel)' }}>Moon</span>
                Rabbit
              </p>
            </div>
          </div>

          {/* 익명 버튼 */}
          <div className="flex justify-start mb-4">
            <button
              onClick={toggleAnonymous}
              className={`px-4 py-2 rounded-lg text-sm font-mainFont transition-colors duration-200 shadow-sm ${
                anonymous
                  ? 'bg-mainColor text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {anonymous ? '익명 작성 중' : '익명으로 작성하기'}
            </button>
          </div>

          {/* 에러 메시지 */}
          {error && <p className="text-red-500 mb-4 font-mainFont">{error}</p>}

          {/* 고민제목 */}
          <div className="mb-6">
            <label
              htmlFor="title"
              className="block text-[20px] font-mainFont mb-2 text-mainBlack"
            >
              제목
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="고민의 제목을 입력해주세요"
              className="w-full px-4 py-3 text-[16px] border-2 border-lightBeige rounded-lg focus:outline-none focus:border-mainColor transition-colors duration-200 placeholder:text-mainGray"
            />
          </div>

          {/* 태그 + 카테고리 */}
          <div className={MODAL_STYLES.sectionSpacing}>
            <label className="flex text-lg font-mainFont">태그</label>
            <div className="mt-2 justify-end">
              <CategoryBar
                selectedCategory={selectedCategory}
                onCategoryChange={onCategoryChange}
                disableCentering={true}
              />
            </div>
          </div>

          {/* 고민내용 */}
          <div className="mb-6 relative">
            <label
              htmlFor="content"
              className="block text-[20px] mb-2 font-mainFont"
            >
              내용
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => onContentChange(e.target.value)}
              placeholder="고민을 자유롭게 작성해주세요."
              className="w-full px-4 py-3 text-[16px] border-2 border-lightBeige rounded-lg focus:outline-none focus:border-mainColor transition-colors duration-200 placeholder:text-mainGray min-h-[200px] resize-none"
            />
            <div className="absolute bottom-2 right-2 text-sm text-gray-500 font-mainFont">
              {content.trim().length}/255자 (최소 20자)
            </div>
          </div>
        </div>

        {/* 등록 버튼 */}
        <div className="flex justify-center mt-4">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`px-3 py-1 rounded-lg text-lg font-mainFont shadow-md transition-colors ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-[var(--color-mainColor)] text-white hover:bg-red-600'
            }`}
          >
            {loading ? '등록 중...' : '등록'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreateConcernModal
