import React from 'react'
import axios from 'axios'
import { useCommentStore } from '../stores/useCommentStore'
import { useParams } from 'react-router-dom'
import { ENDPOINTS } from '../api/endpoints'

interface CommentInputProps {
  parentId?: number | null
}

export const CommentInput: React.FC<CommentInputProps> = ({
  parentId = null,
}) => {
  const { pageNumber } = useParams<{ pageNumber: string }>() // 추후 App.ts에서 boardId로 수정
  const boardId = pageNumber
  const { commentContent, setCommentContent, replyContents, setReplyContent } =
    useCommentStore()

  const value =
    parentId !== null ? replyContents[parentId] || '' : commentContent

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value
    if (parentId !== null) {
      setReplyContent(parentId, val)
    } else {
      setCommentContent(val)
    }
  }

  const handleSubmit = async () => {
    const token = localStorage.getItem('accessToken')
    console.log('토큰:', token)
    if (!token) {
      console.log('토큰이 없습니다.')
      alert('로그인이 필요합니다.')
      return
    }

    // 토큰 만료 시간 확인
    try {
      const tokenData = JSON.parse(atob(token.split('.')[1]))
      const expirationTime = tokenData.exp * 1000 // Convert to milliseconds
      if (Date.now() >= expirationTime) {
        console.log('토큰이 만료되었습니다.')
        localStorage.removeItem('accessToken')
        alert('로그인이 만료되었습니다. 다시 로그인해주세요.')
        return
      }
    } catch (err) {
      console.error('토큰 파싱 실패:', err)
      localStorage.removeItem('accessToken')
      alert('유효하지 않은 토큰입니다. 다시 로그인해주세요.')
      return
    }

    const content = value.trim()
    if (!content) return

    try {
      const requestBody = parentId === null 
        ? { content }
        : { content, parentId }

      console.log('요청 데이터:', {
        url: ENDPOINTS.COMMENT_CREATE(Number(boardId)),
        ...requestBody,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      const response = await axios.post(
        ENDPOINTS.COMMENT_CREATE(Number(boardId)),
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      )

      const newComment = response.data
      useCommentStore.getState().addComment(newComment, parentId)
      console.log('응답 데이터:', newComment)

      // 입력창 초기화
      if (parentId !== null) {
        setReplyContent(parentId, '')
      } else {
        setCommentContent('')
      }
    } catch (err) {
      console.error('댓글 등록 실패', err)
      if (axios.isAxiosError(err)) {
        console.error('에러 응답:', err.response?.data)
        console.error('에러 상태:', err.response?.status)
        
        if (err.response?.status === 401) {
          localStorage.removeItem('accessToken')
          alert('인증이 만료되었습니다. 다시 로그인해주세요.')
        } else if (err.response?.status === 500) {
          alert('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.')
        } else if (err.response?.status === 404) {
          alert('게시글을 찾을 수 없습니다.')
        }
      }
    }
  }

  return (
    <div className="border-2 border-darkWalnut p-[12px] mt-2">
      <textarea
        className="font-gothicFont appearance-none border-none outline-none resize-none bg-transparent p-0 m-0 shadow-none focus:ring-0 focus:outline-none w-full"
        rows={4}
        value={value}
        onChange={onChange}
      />
      <div
        className="cursor-pointer flex justify-self-end bg-mainColor text-mainWhite w-fit p-[4px] px-[10px] rounded-[10px] text-[16px] mt-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.25)]"
        onClick={handleSubmit}
      >
        등록
      </div>
    </div>
  )
}
