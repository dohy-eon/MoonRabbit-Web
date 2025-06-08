import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useBoardDetailStore } from '../stores/useBoardDetailStore'
import { ConcernContent, ConcernAnswer } from '../components/ConcernPost'
import { ConcernComment } from '../components/ConcernComment'

interface ConcernContentProps {
  title: string
  content: string
  date: string
}

interface ConcernAnswerProps {
  answers: Array<{
    id: number
    content: string
    createdAt: string
    userId: number
    nickname: string
    profileImg: string
  }>
}

export const NightSkyDetailPage: React.FC = () => {
  const { pageNumber } = useParams<{ pageNumber: string }>()
  const { boardDetail, fetchBoardDetail } = useBoardDetailStore()

  useEffect(() => {
    if (pageNumber) {
      fetchBoardDetail(parseInt(pageNumber))
    }
  }, [pageNumber, fetchBoardDetail])

  if (!boardDetail) {
    return <div>로딩 중...</div>
  }

  return (
    <div className="flex flex-col items-center">
      <ConcernContent
        title={boardDetail.title}
        content={boardDetail.content}
        date={boardDetail.createdAt}
      />
      <ConcernAnswer />
      <ConcernComment />
    </div>
  )
}
