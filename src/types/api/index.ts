export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

export interface UserInfo {
  id: number;
  name: string;
  email: string;
  birth_date: string;
}

export interface AddLetterRequest {
  sender_name: string;
  content: string;
  amount: number;
}

export interface LetterItem {
  id: number;
  sender_name: string;
  content: string;
  amount: number;
  created_at: string;
}

export interface GetGuestLettersResponse {
  letters: LetterItem[];
  total_amount: number;
}
