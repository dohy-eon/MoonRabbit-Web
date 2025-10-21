import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { ConcernComment } from '@/features/concern-board/components/ConcernComment'
import {
  ConcernContent,
  ConcernAnswer,
} from '@/features/concern-board/components/ConcernPost'
import { useBoardDetailStore } from '@/features/concern-board/stores/useBoardDetailStore'

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
      <ConcernContent />
      <ConcernAnswer />
      <ConcernComment />
    </div>
  )
}
