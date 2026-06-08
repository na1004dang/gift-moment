import axios from 'axios';
import type { ApiResponse, AddLetterRequest, GetGuestLettersResponse } from '../types/api';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const addLetter = async (
  uniqueString: string,
  payload: AddLetterRequest
): Promise<ApiResponse<{}>> => {
  const { data } = await axios.post(
    `${BASE_URL}/api/v1/letters/create/${uniqueString}`,
    payload,
    { headers: { 'Content-Type': 'application/json' } }
  );
  return data;
};

export const getGuestLetters = async (
  uniqueString: string
): Promise<ApiResponse<GetGuestLettersResponse>> => {
  const { data } = await axios.get(
    `${BASE_URL}/api/v1/letters/guestview/${uniqueString}`
  );
  return data;
};

// 소유자 전용 - 풀네임 편지 목록
export const getOwnerLetters = async (
  giftId: number
): Promise<ApiResponse<GetGuestLettersResponse>> => {
  const { data } = await axios.get(
    `${BASE_URL}/api/v1/letters/owner/${giftId}`,
    { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
  );
  return data;
};
