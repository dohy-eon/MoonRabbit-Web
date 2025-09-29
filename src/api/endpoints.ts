// 엔드포인트가 추가/변경될 경우 이 파일만 수정하면 됩니다.

const BASE_URL = 'https://moonrabbit-api.kro.kr/api';

export const ENDPOINTS = {
  // 고민(Concern)
  CONCERN_LIST: (page = 0, size = 9) => `${BASE_URL}/boards/list?page=${page}&size=${size}`,
  CONCERN_DETAIL: (id: number) => `${BASE_URL}/boards/list/${id}`,
  CONCERN_CREATE: `${BASE_URL}/boards/save`,

  // 댓글(Comment)
  COMMENT_LIST: (boardId: number) => `${BASE_URL}/answer/board/${boardId}`,
  COMMENT_CREATE: (boardId: number) => `${BASE_URL}/answer/save?boardId=${boardId}`,

  // 유저(User)
  USER_INFO: `${BASE_URL}/user/info`,
  USER_UPDATE: `${BASE_URL}/user/update`,

  // 인증(Auth)
  LOGIN: `${BASE_URL}/auth/login`,
  SIGNUP: `${BASE_URL}/auth/signup`,
  LOGOUT: `${BASE_URL}/auth/logout`,
  VERIFY: `${BASE_URL}/auth/verify`,

  // 플레이리스트(Playlist)
  PLAYLIST_LIST: `${BASE_URL}/playlists`,

  // 오늘의 질문(Today Question)
  TODAY_QUESTION: `${BASE_URL}/questions/today`,
  QUESTION_ANSWER: (questionId: number) => `${BASE_URL}/questions/${questionId}/answer`,

  // 기타 필요시 추가
  ASSISTANT_ANSWER: (boardId: number, category: string) => `${BASE_URL}/board/${boardId}/assistant/${category}`,
};

export default ENDPOINTS; 