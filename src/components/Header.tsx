import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useResponsiveStore } from '../stores/useResponsiveStore'
import { useAuthStore } from '../stores/useAuthStore'
import useUserStore from '../stores/useUserStore'
import axios from 'axios'

const Header = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { res, setRes } = useResponsiveStore()
  const { isLoggedIn } = useAuthStore()
  const { nickname, setNickname } = useUserStore()

  const isMobile = res === 'mo'

  useEffect(() => {
    const handleResize = () => {
      setRes(window.innerWidth >= 768 ? 'pc' : 'mo')
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [setRes])

  useEffect(() => {
    if (isLoggedIn) {
      const fetchNickname = async () => {
        const token = localStorage.getItem('accessToken')
        try {
          const response = await axios.get(
            `https://moonrabbit-api.kro.kr/api/users/profile`, 
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          setNickname(response.data.nickname)
        } catch (error) {
          console.error('닉네임 조회 실패', error)
        }
      }
      fetchNickname()
    }
  }, [isLoggedIn, setNickname])

  return (
    <div className="bg-darkWalnut text-darkBeige h-14 flex items-center justify-between px-6 md:px-8 shadow-md relative">
      <div className="flex items-center space-x-6">
        <Link to="/" className="text-xl">
          ⋆˚.•✩‧₊⋆
        </Link>

        {/* PC용 네비게이션(왼쪽) */}
        {!isMobile && (
          <nav className="flex tracking-wide space-x-10 font-mainFont text-base">
            <Link to="/night-sky">밤하늘</Link>
            <Link to="/question">오늘의 질문</Link>
            <Link to="/stars">별자리</Link>
            <Link to="/shop">상점</Link>
          </nav>
        )}
      </div>

      {/* PC용 네비게이션(오른쪽) */}
      {!isMobile && (
        <div className="flex items-center space-x-10 font-mainFont text-base">
          {isLoggedIn ? (
            <Link to="/mypage">{nickname}</Link>
          ) : (
            <Link to="/login">로그인 / 회원가입</Link>
          )}
          <Link to="/settings">설정</Link>
        </div>
      )}

      {/* Mobile 햄버거 버튼 */}
      {isMobile && (
        <button
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="메뉴 토글"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      )}

      {/* Mobile 드롭다운 메뉴 */}
      {isOpen && isMobile && (
        <div className="absolute top-14 left-0 w-full bg-darkWalnut flex flex-col items-start px-6 py-4 space-y-4 font-mainFont text-base z-50 shadow-lg">
          <Link to="/night-sky" onClick={() => setIsOpen(false)}>
            밤하늘
          </Link>
          <Link to="/question" onClick={() => setIsOpen(false)}>
            오늘의 질문
          </Link>
          <Link to="/stars" onClick={() => setIsOpen(false)}>
            별자리
          </Link>
          <Link to="/shop" onClick={() => setIsOpen(false)}>
            상점
          </Link>
          {isLoggedIn ? (
            <Link to="/mypage" onClick={() => setIsOpen(false)}>
              {nickname}
            </Link>
          ) : (
            <Link to="/login" onClick={() => setIsOpen(false)}>
              로그인 / 회원가입
            </Link>
          )}
          <Link to="/settings" onClick={() => setIsOpen(false)}>
            설정
          </Link>
        </div>
      )}
    </div>
  )
}

export default Header
