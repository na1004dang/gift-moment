import axios from 'axios';
import type { ApiResponse } from '../types/api';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

export interface WishItem {
  id: number;
  member_id: number;
  title: string;
  description: string;
  link: string;
  price: number;
  target_amount: number;
  current_amount: number;
  image_url: string;
  bank_name: string;
  account_number: string;
  status: string;
  owner_name?: string;
  percent?: number;
}

// 내 위시리스트 목록 (birthday member 전용)
export const getMyWishlist = async (): Promise<ApiResponse<WishItem[]>> => {
  const { data } = await axios.get(`${BASE_URL}/api/v1/wishlists/member/birthday`, {
    headers: authHeader(),
  });
  return data;
};

// 내 위시 상세 (member 뷰)
export const getMyWishDetail = async (gift_id: number): Promise<ApiResponse<WishItem>> => {
  const { data } = await axios.get(`${BASE_URL}/api/v1/wishlists/member/gift`, {
    params: { gift_id },
    headers: authHeader(),
  });
  return data;
};

// 공유 링크로 위시 조회 (giver 공개 뷰)
export const getWishByLink = async (unique_string: string): Promise<ApiResponse<WishItem>> => {
  const { data } = await axios.get(`${BASE_URL}/api/v1/wishlists/giver/bylink`, {
    params: { unique_string },
  });
  return data;
};

// 선물 상세 조회 (giver 로그인 뷰)
export const getWishDetailForGiver = async (gift_id: number): Promise<ApiResponse<WishItem>> => {
  const { data } = await axios.get(`${BASE_URL}/api/v1/wishlists/giver/gift`, {
    params: { gift_id },
    headers: authHeader(),
  });
  return data;
};

// 위시 추가
export const addWishItem = async (formData: FormData): Promise<ApiResponse<{ gift_id: number }>> => {
  const { data } = await axios.post(`${BASE_URL}/api/v1/wishlists`, formData, {
    headers: { ...authHeader(), 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

// 위시 수정
export const modifyWishItem = async (gift_id: number, formData: FormData): Promise<ApiResponse<{}>> => {
  const { data } = await axios.patch(`${BASE_URL}/api/v1/wishlists/${gift_id}`, formData, {
    headers: { ...authHeader(), 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

// 위시 삭제
export const deleteWishItem = async (gift_id: number): Promise<ApiResponse<{}>> => {
  const { data } = await axios.delete(`${BASE_URL}/api/v1/wishlists/${gift_id}`, {
    headers: authHeader(),
  });
  return data;
};

// 편지 링크 생성
export const getLetterLink = async (gift_id: number): Promise<ApiResponse<{ unique_string: string }>> => {
  const { data } = await axios.get(`${BASE_URL}/api/v1/letters/copy`, {
    params: { gift_id },
    headers: authHeader(),
  });
  return data;
};
