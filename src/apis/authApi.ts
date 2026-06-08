import axios from 'axios';
import type { ApiResponse, UserInfo } from '../types/api';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;
const KAKAO_REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;
const KAKAO_REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI;

// 카카오 인가 URL (프론트에서 리다이렉트)
export const getKakaoLoginUrl = () =>
  `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_REST_API_KEY}&redirect_uri=${encodeURIComponent(KAKAO_REDIRECT_URI)}&response_type=code`;

// 백엔드에 code를 보내서 로그인 처리 (토큰 교환은 백엔드에서)
export const kakaoLoginWithCode = async (
  code: string
): Promise<ApiResponse<{ token: string; user_id: number; name: string }>> => {
  const { data } = await axios.post(`${BASE_URL}/api/v1/auth/kakao/code`, { code });
  return data;
};

export const getMyInfo = async (): Promise<ApiResponse<UserInfo>> => {
  const { data } = await axios.get(`${BASE_URL}/api/v1/mypage`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  return data;
};

export const getNavigateInfo = async (): Promise<ApiResponse<{ name: string; birth_date: string; is_birthday: boolean }>> => {
  const { data } = await axios.get(`${BASE_URL}/api/v1/auth/navigate`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  return data;
};

export const updateProfile = async (payload: { name?: string; email?: string; birth_date?: string }) => {
  const { data } = await axios.patch(`${BASE_URL}/api/v1/auth/profile`, payload, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  return data;
};
