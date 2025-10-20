import React, { useMemo, useState, memo, useCallback, useEffect } from "react"
import CenteredPopup from "./CenteredPopup"
import MyBoardContents from "./MyBoardContents"
import UserInventory from "./UserInventory"
import clsx from "clsx"
import { useResponsiveStore } from "../stores/useResponsiveStore"
import { useUserProfileStore } from "../stores/useUserProfileStore"

const MypageSidebar: React.FC = memo(() => {
  const { userProfile, fetchUserProfile } = useUserProfileStore()
  
  useEffect(() => {
    if (!userProfile) {
      fetchUserProfile()
    }
  }, [userProfile, fetchUserProfile])
  
  const level = userProfile?.level || 1
  const [showAllStars, setShowAllStars] = useState(false)
  const [popupOpen, setPopupOpen] = useState<null | 'nightSky' | 'constellation'>(null)

  const starCount = useMemo(() => Math.floor(level / 10), [level])
  const visibleStarCount = useMemo(
    () => (showAllStars ? starCount : Math.min(5, starCount)),
    [showAllStars, starCount]
  )
  
  // 현재 레벨의 경험치 정보
  const expInfo = useMemo(() => {
    if (!userProfile) return { current: 0, required: 100, percentage: 0 }
    
    const currentExp = (userProfile.totalPoint - (level-1)*30) *10
    const requiredExp = 300
    const percentage = Math.min(Math.max((currentExp / requiredExp) * 100, 0), 100)
    
    return {
      current: Math.max(currentExp, 0),
      required: requiredExp,
      percentage,
    }
  }, [userProfile])

  const res = useResponsiveStore((state) => state.res)
  const isMobile = res === 'mo'

  const handleNightSkyClick = useCallback(() => setPopupOpen('nightSky'), [])
  const handleConstellationClick = useCallback(() => setPopupOpen('constellation'), [])
  const handleClosePopup = useCallback(() => setPopupOpen(null), [])
  const handleShowAllStars = useCallback(() => setShowAllStars(true), [])
  const handleHideStars = useCallback(() => setShowAllStars(false), [])

  return (
    <div className={clsx("bg-darkWalnut px-4 flex flex-col justify-center gap-4 border-b-1 border-subBlack",
      isMobile ?
      "w-full pb-12 " : "w-[500px]"
    )}>
      <div className="flex flex-col gap-2">
        <div className={clsx("font-mainFont text-white",
          isMobile ?
          "pt-8 text-[16px]" : "text-[2vw]"
        )}>
          레벨
          <span className={clsx(isMobile ? "" : "ml-[1vw]")}>
            {level}
          </span>
        </div>
        
        {/* 경험치 정보 */}
        <div className="flex items-center gap-2">
          <span className={clsx("font-gothicFont text-white/80", isMobile ? "text-[10px]" : "text-[0.9vw]")}>
            {expInfo.current} / {expInfo.required} EXP
          </span>
        </div>
        
        {/* 경험치 프로그레스바 */}
        <div className={clsx("bg-white/20 rounded-full overflow-hidden", isMobile ? "h-2" : "h-3")}>
          <div 
            className="bg-gradient-to-r from-mainColor to-lightCaramel h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${expInfo.percentage}%` }}
          />
        </div>
      </div>
      <div className={clsx(isMobile ? "" : "p-3")}>
        <div className="grid grid-cols-5 gap-2 place-items-center">
          {Array.from({ length: visibleStarCount }).map((_, index) => (
            <img
              key={index}
              src="/images/LevelStar.png"
              alt="레벨 별"
              className={clsx("object-contain", 
                isMobile ?
                "w-8 h-8" : "w-10 h-10"
              )}
            />
          ))}
        </div>
        {starCount > 5 && !showAllStars && (
          <button
            onClick={handleShowAllStars}
            className={clsx("mt-4 text-white block ml-auto font-gothicFont",
              isMobile ? "text-[12px]" : "text-[1vw]"
            )}
          >
            더보기
          </button>
        )}
        {starCount > 5 && showAllStars && (
          <button
            onClick={handleHideStars}
            className={clsx("mt-4 text-white block ml-auto font-gothicFont",
              isMobile ? "text-[12px]" : "text-[1vw]"
            )}
          >
            접기
          </button>
        )}
      </div>
      <button onClick={handleNightSkyClick} className={clsx('cursor-pointer flex items-center justify-center rounded-xl bg-mainColor text-white font-mainFont w-full py-2 mr-8',
        isMobile ? "text-[16px]" : "text-[1.5vw]"
      )}>
        내 밤하늘
      </button>
      <button onClick={handleConstellationClick} className={clsx('cursor-pointer flex items-center justify-center rounded-xl bg-mainColor text-white font-mainFont w-full py-2 mr-8',
        isMobile ? "text-[16px]" : "text-[1.5vw]"
      )}>
        내 아이템
      </button>

      <CenteredPopup
        title={popupOpen === 'nightSky' ? '내 밤하늘' : '내 아이템'}
        isOpen={popupOpen !== null}
        onClose={handleClosePopup}
      >
        {popupOpen === 'nightSky' ? (
          <MyBoardContents />
        ) : (
          <UserInventory userId={userProfile?.userId || 0} />
        )}
      </CenteredPopup>

    </div>
  )
})

export default MypageSidebar
