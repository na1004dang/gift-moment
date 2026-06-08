import styled from 'styled-components';
import { getKakaoLoginUrl } from '../../apis/authApi';

export default function AccountCheck() {
  const handleKakaoLogin = () => {
    window.location.href = getKakaoLoginUrl();
  };

  return (
    <Container>
      <Logo>🎁</Logo>
      <Title>Gift Moment</Title>
      <Subtitle>소중한 사람의 생일을 함께 축하해요</Subtitle>
      <Desc>펀딩으로 선물을 모으고, 마음을 담은 편지를 전해보세요</Desc>
      <KakaoBtn onClick={handleKakaoLogin}>
        <KakaoIcon>
          <svg width="20" height="20" viewBox="0 0 512 512" fill="black">
            <path d="M255.5 48C143.6 48 52.5 118.4 52.5 205c0 51.6 30.5 97.5 77.4 127.3-3.4 12.3-21.8 79.3-22.5 83.9 0 0-.4 3.2 1.7 4.4 2.1 1.2 4.5.2 4.5.2 5.9-.8 68.1-44.7 79.3-52.1 19.8 3.4 40.3 5.3 61.6 5.3 111.9 0 203-70.4 203-157S367.4 48 255.5 48z"/>
          </svg>
        </KakaoIcon>
        카카오로 시작하기
      </KakaoBtn>
    </Container>
  );
}

const Container = styled.div`
  max-width: 400px;
  margin: 0 auto;
  padding: 80px 24px 40px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Logo = styled.div`
  font-size: 64px;
  margin-bottom: 16px;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #ff6b9d;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  font-size: 17px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
`;

const Desc = styled.p`
  font-size: 14px;
  color: #888;
  line-height: 1.6;
  margin-bottom: 48px;
`;

const KakaoBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  max-width: 320px;
  padding: 16px;
  background: #fee500;
  color: #000;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  &:hover { background: #f0d800; }
`;

const KakaoIcon = styled.span`
  display: flex;
  align-items: center;
`;
