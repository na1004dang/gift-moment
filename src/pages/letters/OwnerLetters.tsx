import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { getOwnerLetters } from '../../apis/guestLetterApi';
import type { LetterItem } from '../../types/api';

export default function OwnerLetters() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const giftId = Number(searchParams.get('gift_id'));

  const [letters, setLetters] = useState<LetterItem[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!giftId) return;
    getOwnerLetters(giftId)
      .then((res) => {
        setLetters(res.data.letters);
        setTotalAmount(res.data.total_amount);
      })
      .finally(() => setLoading(false));
  }, [giftId]);

  if (loading) return <Loading>불러오는 중...</Loading>;

  return (
    <Container>
      <Header>
        <BackBtn onClick={() => navigate(`/wish/detail?gift_id=${giftId}`)}>←</BackBtn>
        <HeaderText>
          <h2>편지 관리</h2>
          <AdminBadge>🔒 관리자 전용</AdminBadge>
        </HeaderText>
      </Header>

      <TotalBox>
        <TotalLabel>총 모인 금액</TotalLabel>
        <TotalAmount>{totalAmount.toLocaleString()}원</TotalAmount>
        <TotalCount>{letters.length}명이 선물했어요</TotalCount>
      </TotalBox>

      {letters.length === 0 ? (
        <Empty>아직 편지가 없어요 💌</Empty>
      ) : (
        <LetterList>
          {letters.map((l, idx) => (
            <LetterCard key={l.id}>
              <CardHeader>
                <IndexBadge>{idx + 1}</IndexBadge>
                <SenderName>{l.sender_name}</SenderName>
                <Amount>{l.amount.toLocaleString()}원</Amount>
              </CardHeader>
              <Content>{l.content}</Content>
              <DateText>{new Date(l.created_at).toLocaleString('ko-KR')}</DateText>
            </LetterCard>
          ))}
        </LetterList>
      )}
    </Container>
  );
}

const Container = styled.div`
  max-width: 400px;
  margin: 0 auto;
  padding: 24px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
`;

const BackBtn = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  flex-shrink: 0;
`;

const HeaderText = styled.div`
  h2 { font-size: 20px; font-weight: 700; margin-bottom: 4px; }
`;

const AdminBadge = styled.span`
  font-size: 12px;
  background: #fff3cd;
  color: #856404;
  padding: 2px 8px;
  border-radius: 20px;
  font-weight: 600;
`;

const TotalBox = styled.div`
  background: #fff0f6;
  border: 1.5px solid #ffb3d1;
  border-radius: 16px;
  padding: 20px;
  text-align: center;
  margin-bottom: 24px;
`;

const TotalLabel = styled.p`
  font-size: 13px;
  color: #888;
  margin-bottom: 6px;
`;

const TotalAmount = styled.p`
  font-size: 32px;
  font-weight: 800;
  color: #ff6b9d;
  margin-bottom: 4px;
`;

const TotalCount = styled.p`
  font-size: 13px;
  color: #aaa;
`;

const LetterList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const LetterCard = styled.div`
  border: 1px solid #eee;
  border-radius: 14px;
  padding: 16px;
  background: #fafafa;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
`;

const IndexBadge = styled.span`
  width: 24px;
  height: 24px;
  background: #ff6b9d;
  color: white;
  border-radius: 50%;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const SenderName = styled.span`
  font-weight: 700;
  font-size: 16px;
  flex: 1;
`;

const Amount = styled.span`
  color: #ff6b9d;
  font-weight: 700;
  font-size: 15px;
`;

const Content = styled.p`
  font-size: 14px;
  color: #555;
  line-height: 1.7;
  margin-bottom: 8px;
  white-space: pre-wrap;
`;

const DateText = styled.p`
  font-size: 12px;
  color: #bbb;
`;

const Empty = styled.div`
  text-align: center;
  padding: 60px 0;
  color: #aaa;
  font-size: 16px;
`;

const Loading = styled.div`
  text-align: center;
  padding: 80px 24px;
  color: #888;
`;
