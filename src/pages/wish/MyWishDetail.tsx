import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { getMyWishDetail, deleteWishItem, getLetterLink } from '../../apis/wishItemApi';
import type { WishItem } from '../../apis/wishItemApi';

export default function MyWishDetail() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const giftId = Number(params.get('gift_id'));
  const [wish, setWish] = useState<WishItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!giftId) return;
    getMyWishDetail(giftId)
      .then((res) => setWish(res.data))
      .finally(() => setLoading(false));
  }, [giftId]);

  const handleDelete = async () => {
    if (!wish || !confirm('위시리스트를 삭제하시겠습니까?')) return;
    await deleteWishItem(wish.id);
    navigate('/wish/my');
  };

  const handleShare = async () => {
    if (!wish) return;
    try {
      const res = await getLetterLink(wish.id);
      const url = `${window.location.origin}/wish/user?unique=${res.data.unique_string}`;
      await navigator.clipboard.writeText(url);
      alert('공유 링크가 복사되었습니다!');
    } catch {
      alert('링크 생성에 실패했습니다.');
    }
  };

  if (loading) return <Loading>불러오는 중...</Loading>;
  if (!wish) return <Loading>위시리스트를 찾을 수 없습니다.</Loading>;

  const percent = wish.target_amount > 0
    ? Math.min(100, Math.round((wish.current_amount / wish.target_amount) * 100))
    : 0;

  return (
    <Container>
      <Header>
        <BackBtn onClick={() => navigate('/wish/my')}>←</BackBtn>
        <h2>내 위시리스트</h2>
      </Header>
      {wish.image_url && <GiftImage src={wish.image_url} alt={wish.title} />}
      <GiftName>{wish.title}</GiftName>
      {wish.description && <GiftContent>{wish.description}</GiftContent>}
      {wish.link && (
        <GiftLink href={wish.link} target="_blank" rel="noopener noreferrer">
          상품 링크 보기 →
        </GiftLink>
      )}
      <AmountSection>
        <ProgressBar>
          <ProgressFill $percent={percent} />
        </ProgressBar>
        <AmountRow>
          <span style={{ color: '#ff6b9d', fontWeight: 700 }}>{wish.current_amount.toLocaleString()}원 모임</span>
          <span style={{ color: '#888' }}>목표 {wish.target_amount.toLocaleString()}원 ({percent}%)</span>
        </AmountRow>
      </AmountSection>
      <ButtonRow>
        <ShareBtn onClick={handleShare}>링크 공유</ShareBtn>
        <EditBtn onClick={() => navigate(`/wish/modify?gift_id=${wish.id}`)}>수정</EditBtn>
        <DeleteBtn onClick={handleDelete}>삭제</DeleteBtn>
      </ButtonRow>
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

const ButtonRow = styled.div`
  display: flex;
  gap: 8px;
`;

const ShareBtn = styled.button`
  flex: 1;
  padding: 14px;
  background: #ff6b9d;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
`;

const EditBtn = styled.button`
  flex: 1;
  padding: 14px;
  background: white;
  color: #ff6b9d;
  border: 1.5px solid #ff6b9d;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
`;

const DeleteBtn = styled.button`
  flex: 1;
  padding: 14px;
  background: white;
  color: #e53e3e;
  border: 1.5px solid #e53e3e;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
`;

const Loading = styled.div`
  text-align: center;
  padding: 80px 24px;
  color: #888;
`;
