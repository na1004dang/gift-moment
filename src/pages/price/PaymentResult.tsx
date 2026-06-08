import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

export default function PaymentResult() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const amount = Number(params.get('amount') || 0);
  const senderName = params.get('sender') || '';
  const uniqueString = params.get('unique') || '';
  const ownerName = params.get('owner') || '';
  const bankName = params.get('bank') || '';
  const accountNumber = params.get('account') || '';

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const [copied, setCopied] = useState(false);

  const copyAccount = () => {
    navigator.clipboard.writeText(accountNumber).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // 카카오페이: 앱 실행 후 송금 탭으로 안내
  const openKakaoPay = () => {
    if (isMobile) {
      const isAndroid = /Android/i.test(navigator.userAgent);
      // 카카오페이 앱 직접 실행 (transfer 경로 미지원 → 메인 화면으로)
      window.location.href = 'kakaopay://';
      setTimeout(() => {
        // 앱이 없으면 스토어로
        window.open(
          isAndroid
            ? 'market://details?id=com.kakaopay.app'
            : 'https://apps.apple.com/kr/app/kakaopay/id1102199660',
          '_blank'
        );
      }, 2000);
    } else {
      window.open('https://kakaopay.com', '_blank');
    }
  };

  // 토스 앱 열기 (금액 pre-fill 지원)
  const openToss = () => {
    if (isMobile) {
      window.location.href = `supertoss://send?amount=${amount}`;
      setTimeout(() => {
        window.open('https://toss.im', '_blank');
      }, 1500);
    } else {
      window.open(`https://toss.im`, '_blank');
    }
  };

  return (
    <Container>
      <CheckCircle>
        <CheckMark>✓</CheckMark>
      </CheckCircle>

      <Title>편지를 보냈어요! 💌</Title>
      <Subtitle>
        {ownerName ? `${ownerName}님` : '선물 받는 분'}께 마음을 전달했습니다
      </Subtitle>

      <AmountCard>
        <AmountLabel>송금할 선물 금액</AmountLabel>
        <AmountValue>{amount.toLocaleString()}원</AmountValue>
        {senderName && <SenderInfo>보내는 사람: {senderName}</SenderInfo>}
      </AmountCard>

      {isMobile ? (
        <InfoBox>
          <InfoText>💡 카카오페이 앱이 열리면 <strong>송금</strong> 탭에서</InfoText>
          <InfoText><strong>{ownerName || '선물 받는 분'}</strong>을 검색 후 <strong>{amount.toLocaleString()}원</strong>을 보내주세요.</InfoText>
        </InfoBox>
      ) : (
        <InfoBox>
          <InfoText>💡 PC에서는 카카오페이 / 토스 앱을 이용해주세요.</InfoText>
          <InfoText>모바일에서 접속하면 앱으로 바로 연결됩니다.</InfoText>
        </InfoBox>
      )}

      <ButtonGroup>
        <KakaoPayBtn onClick={openKakaoPay}>
          <BtnIcon>
            <svg width="20" height="20" viewBox="0 0 512 512" fill="black">
              <path d="M255.5 48C143.6 48 52.5 118.4 52.5 205c0 51.6 30.5 97.5 77.4 127.3-3.4 12.3-21.8 79.3-22.5 83.9 0 0-.4 3.2 1.7 4.4 2.1 1.2 4.5.2 4.5.2 5.9-.8 68.1-44.7 79.3-52.1 19.8 3.4 40.3 5.3 61.6 5.3 111.9 0 203-70.4 203-157S367.4 48 255.5 48z"/>
            </svg>
          </BtnIcon>
          카카오페이로 송금
        </KakaoPayBtn>

        <TossBtn onClick={openToss}>
          <BtnIcon>💙</BtnIcon>
          토스로 {amount.toLocaleString()}원 송금
        </TossBtn>

        {bankName && accountNumber && (
          <AccountBtn onClick={copyAccount} $copied={copied}>
            <BtnIcon>{copied ? '✅' : '🏦'}</BtnIcon>
            {copied
              ? '계좌번호 복사됨!'
              : `${bankName} ${accountNumber} 복사`}
          </AccountBtn>
        )}
      </ButtonGroup>

      {bankName && accountNumber && (
        <AccountInfoBox>
          <AccountInfoRow>
            <span>은행</span>
            <strong>{bankName}</strong>
          </AccountInfoRow>
          <AccountInfoRow>
            <span>계좌번호</span>
            <AccountNumText>{accountNumber}</AccountNumText>
          </AccountInfoRow>
          <AccountInfoRow>
            <span>예금주</span>
            <strong>{ownerName || '선물 받는 분'}</strong>
          </AccountInfoRow>
          <CopyFullBtn onClick={copyAccount} $copied={copied}>
            {copied ? '✅ 복사됐습니다!' : '📋 계좌번호 복사하기'}
          </CopyFullBtn>
        </AccountInfoBox>
      )}

      {!bankName && (
        <>
          <Divider>
            <DividerLine /><DividerText>또는</DividerText><DividerLine />
          </Divider>
          <ManualInfo>
            <ManualTitle>직접 계좌이체</ManualTitle>
            <ManualDesc>
              선물 받는 분의 카카오톡으로<br />
              계좌번호를 문의하고 직접 이체해주세요.
            </ManualDesc>
          </ManualInfo>
        </>
      )}

      <BackBtn onClick={() => navigate(`/wish/user?unique=${uniqueString}`)}>
        나중에 송금하기
      </BackBtn>
    </Container>
  );
}

const popIn = keyframes`
  0% { transform: scale(0); opacity: 0; }
  70% { transform: scale(1.15); }
  100% { transform: scale(1); opacity: 1; }
`;

const Container = styled.div`
  max-width: 400px;
  margin: 0 auto;
  padding: 48px 24px 40px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
`;

const CheckCircle = styled.div`
  width: 80px;
  height: 80px;
  background: #ff6b9d;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${popIn} 0.5s ease-out;
`;

const CheckMark = styled.span`
  color: white;
  font-size: 40px;
  line-height: 1;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
`;

const Subtitle = styled.p`
  font-size: 15px;
  color: #666;
  margin-top: -8px;
`;

const AmountCard = styled.div`
  width: 100%;
  background: #fff0f6;
  border: 2px solid #ffb3d1;
  border-radius: 16px;
  padding: 20px;
`;

const AmountLabel = styled.p`
  font-size: 13px;
  color: #888;
  margin-bottom: 6px;
`;

const AmountValue = styled.p`
  font-size: 36px;
  font-weight: 800;
  color: #ff6b9d;
  margin-bottom: 6px;
`;

const SenderInfo = styled.p`
  font-size: 13px;
  color: #aaa;
`;

const InfoBox = styled.div`
  width: 100%;
  background: #fffde7;
  border-radius: 12px;
  padding: 14px 16px;
`;

const InfoText = styled.p`
  font-size: 13px;
  color: #666;
  line-height: 1.7;
`;

const ButtonGroup = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const KakaoPayBtn = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 15px;
  background: #fee500;
  color: #000;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  &:hover { background: #f0d800; }
`;

const TossBtn = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 15px;
  background: #0064ff;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  &:hover { background: #0052d4; }
`;

const BtnIcon = styled.span`
  display: flex;
  align-items: center;
  font-size: 18px;
`;

const Divider = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const DividerLine = styled.div`
  flex: 1;
  height: 1px;
  background: #eee;
`;

const DividerText = styled.span`
  font-size: 13px;
  color: #aaa;
`;

const ManualInfo = styled.div`
  width: 100%;
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 16px;
`;

const ManualTitle = styled.p`
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 8px;
`;

const ManualDesc = styled.p`
  font-size: 13px;
  color: #888;
  line-height: 1.6;
`;

const AccountBtn = styled.button<{ $copied: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 15px;
  background: ${({ $copied }) => $copied ? '#e8f5e9' : '#f5f5f5'};
  color: ${({ $copied }) => $copied ? '#2e7d32' : '#333'};
  border: 1.5px solid ${({ $copied }) => $copied ? '#a5d6a7' : '#ddd'};
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
`;

const AccountInfoBox = styled.div`
  width: 100%;
  background: #f8f9fa;
  border: 1.5px solid #e9ecef;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const AccountInfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  span { font-size: 13px; color: #888; }
  strong { font-size: 14px; color: #333; }
`;

const AccountNumText = styled.strong`
  font-size: 16px !important;
  font-weight: 800 !important;
  color: #1a1a1a !important;
  letter-spacing: 0.5px;
`;

const CopyFullBtn = styled.button<{ $copied: boolean }>`
  width: 100%;
  padding: 12px;
  margin-top: 4px;
  background: ${({ $copied }) => $copied ? '#e8f5e9' : '#fff'};
  color: ${({ $copied }) => $copied ? '#2e7d32' : '#ff6b9d'};
  border: 1.5px solid ${({ $copied }) => $copied ? '#a5d6a7' : '#ff6b9d'};
  border-radius: 10px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
`;


const BackBtn = styled.button`
  background: none;
  border: none;
  color: #bbb;
  font-size: 14px;
  cursor: pointer;
  text-decoration: underline;
  &:hover { color: #888; }
`;
