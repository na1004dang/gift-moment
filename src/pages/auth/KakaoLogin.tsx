import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { kakaoLoginWithCode } from '../../apis/authApi';

export default function KakaoCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error || !code) {
      console.error('카카오 로그인 취소 또는 오류:', error);
      navigate('/');
      return;
    }

    kakaoLoginWithCode(code)
      .then((res) => {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user_id', String(res.data.user_id));
        localStorage.setItem('user_name', res.data.name);
        navigate('/wish/my');
      })
      .catch((err) => {
        console.error('로그인 실패:', err);
        navigate('/');
      });
  }, []);

  return (
    <Container>
      <Spinner />
      <p>카카오 로그인 처리 중...</p>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  gap: 16px;
  color: #888;
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid #eee;
  border-top-color: #ff6b9d;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  @keyframes spin { to { transform: rotate(360deg); } }
`;
