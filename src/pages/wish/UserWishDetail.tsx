import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { getWishByLink } from '../../apis/wishItemApi';
import type { WishItem } from '../../apis/wishItemApi';

export default function UserWishDetail() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const uniqueString = params.get('unique') || '';
  const [wish, setWish] = useState<WishItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!uniqueString) {
      setError('유효하지 않은 링크입니다.');
      setLoading(false);
      return;
    }
    getWishByLink(uniqueString)
      .then((res) => setWish(res.data))
      .catch(() => setError('위시리스트를 불러올 수 없습니다.'))
      .finally(() => setLoading(false));
  }, [uniqueString]);

  if (loading) return <Loading>불러오는 중...</Loading>;
  if (error || !wish) return <Loading>{error || '위시리스트를 찾을 수 없습니다.'}</Loading>;

  const percent = wish.target_amount > 0
    ? Math.min(100, Math.round((wish.current_amount / wish.target_amount) * 100))
    : 0;

  return (
    <Container>
      <Header>
        <BackBtn onClick={() => navigate(-1)}>←</BackBtn>
        <h2>선물 펀딩</h2>
      </Header>
      {wish.owner_name && <OwnerBadge>{wish.owner_name}님의 위시리스트</OwnerBadge>}
      {wish.image_url && <GiftImage src={wish.image_url} alt={wish.title} />}
      <GiftName>{wish.title}</GiftName>
      {wish.description && <GiftContent>{wish.description}</GiftContent>}
      {wish.link && (
        <GiftLink href={wish.link} target="_blank" rel="noopener noreferrer">
          상품 보러가기 →
        </GiftLink>
      )}
      <AmountSection>
        <ProgressBar>
          <ProgressFill $percent={percent} />
        </ProgressBar>
        <AmountRow>
          <span style={{ color: '#ff6b9d', fontWeight: 700 }}>
            {wish.current_amount.toLocaleString()}원 모임
          </span>
          <span style={{ color: '#888' }}>목표 {wish.target_amount.toLocaleString()}원 ({percent}%)</span>
        </AmountRow>
      </AmountSection>
      <FundBtn onClick={() => navigate(`/letters/${uniqueString}`)}>
        💌 선물 & 편지 보내기
      </FundBtn>
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
  gap: 16px;
  margin-bottom: 24px;
  h2 { font-size: 20px; font-weight: 700; }
`;

const BackBtn = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
`;

const OwnerBadge = styled.p`
  color: #ff6b9d;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 16px;
`;

const GiftImage = styled.img`
  width: 100%;
  height: 240px;
  object-fit: cover;
  border-radius: 16px;
  margin-bottom: 20px;
`;

const GiftName = styled.h3`
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 12px;
`;

const GiftContent = styled.p`
  color: #666;
  line-height: 1.6;
  margin-bottom: 12px;
`;

const GiftLink = styled.a`
  display: inline-block;
  color: #ff6b9d;
  font-size: 14px;
  margin-bottom: 24px;
  &:hover { text-decoration: underline; }
`;

const AmountSection = styled.div`
  margin-bottom: 32px;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: #eee;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
`;

const ProgressFill = styled.div<{ $percent: number }>`
  width: ${({ $percent }) => $percent}%;
  height: 100%;
  background: #ff6b9d;
  border-radius: 4px;
`;

const AmountRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 14px;
`;

const FundBtn = styled.button`
  width: 100%;
  padding: 16px;
  background: #ff6b9d;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 17px;
  font-weight: 700;
  cursor: pointer;
  &:hover { background: #ff4d8d; }
`;

const Loading = styled.div`
  text-align: center;
  padding: 80px 24px;
  color: #888;
`;
