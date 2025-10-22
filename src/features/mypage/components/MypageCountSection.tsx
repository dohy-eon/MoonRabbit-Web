import clsx from 'clsx'
import React, { memo, useMemo, useEffect } from 'react'

import NightSkyBg from '@/assets/images/NightSkyBackground.png'
import { useResponsiveStore } from '@/common/hooks/useResponsiveStore'

import { useMypageStore } from '../stores/useMypageStore'
import { useUserProfileStore } from '../stores/useUserProfileStore'

interface MypageCountSectionProps {
  isOwnPage: boolean
  userId?: number
}

const MypageCountSection: React.FC<MypageCountSectionProps> = memo(
  ({ isOwnPage, userId }) => {
    const {
      totalBoardCount,
      otherUserBoardCount,
      fetchTotalBoardCount,
      fetchOtherUserConcerns,
    } = useMypageStore()

    const { otherUserProfile, fetchUserProfileById } = useUserProfileStore()

    useEffect(() => {
      if (isOwnPage) {
        fetchTotalBoardCount()
      } else if (userId) {
        fetchOtherUserConcerns(userId, 0)
        fetchUserProfileById(userId)
      }
    }, [
      fetchTotalBoardCount,
      fetchOtherUserConcerns,
      fetchUserProfileById,
      userId,
      isOwnPage,
    ])

    const boardCount = isOwnPage ? totalBoardCount : otherUserBoardCount

    const res = useResponsiveStore((state) => state.res)
    const isMobile = res === 'mo'

    const backgroundStyle = useMemo(
      () => ({
        backgroundImage: `url(${NightSkyBg})`,
      }),
      [],
    )

    return (
      <>
        <div
          className={clsx(
            'bg-black rounded-b-3xl rounded-t-[30px]',
            isMobile ? 'mx-2 my-4' : 'mx-[2vw] my-[8vw]',
          )}
        >
          <div className="font-mainFont bg-white text-[16px] sm:text-[2vw] rounded-t-3xl pl-4 py-2">
            2025년 달토끼 돌아보기
          </div>
          <div
            className={clsx(
              'flex text-white font-mainFont',
              isMobile ? 'h-[150px]' : 'h-[20vw]',
            )}
          >
            <div
              className="w-full p-4 sm:p-[2vw] rounded-b-3xl flex flex-col justify-end bg-center bg-cover"
              style={backgroundStyle}
            >
              <p
                className={clsx(
                  'font-gothicFont',
                  isMobile ? 'text-[20px]' : 'text-[2vw]',
                )}
              >
                {isOwnPage
                  ? '내가 그린 밤하늘'
                  : `${otherUserProfile?.nickname || ''}의 밤하늘`}
              </p>
              <p
                className={clsx(isMobile ? 'text-[28px]' : 'text-[4vw]')}
              >
                {boardCount}
              </p>
            </div>
          </div>
        </div>
      </>
    )
  },
)

export default MypageCountSection
