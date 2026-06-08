import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { getMyWishlist } from '../../apis/wishItemApi';
import type { WishItem } from '../../apis/wishItemApi';

export default function UserWishList() {
  const navigate = useNavigate();
  const userName = localStorage.getItem('user_name') || '';
  const [wishes, setWishes] = useState<WishItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyWishlist()
      .then((res) => setWishes(res.data))
      .catch(() => setWishes([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading>불러오는 중...</Loading>;

  return (
    <Container>
      <Header>
        <Greeting>{userName ? `${userName}님의` : '내'} 위시리스트</Greeting>
        <CreateBtn onClick={() => navigate('/wish/create')}>+ 만들기</CreateBtn>
      </Header>
      {wishes.length === 0 ? (
        <Empty>
          <EmptyIcon>🎁</EmptyIcon>
          <p>아직 위시리스트가 없어요</p>
          <CreateBtn onClick={() => navigate('/wish/create')}>첫 위시리스트 만들기</CreateBtn>
        </Empty>
      ) : (
        <Grid>
          {wishes.map((w) => {
            const percent = w.target_amount > 0
              ? Math.min(100, Math.round((w.current_amount / w.target_amount) * 100))
              : 0;
            return (
              <Card key={w.id} onClick={() => navigate(`/wish/detail?gift_id=${w.id}`)}>
                {w.image_url && <CardImg src={w.image_url} alt={w.title} />}
                <CardBody>
                  <CardTitle>{w.title}</CardTitle>
                  <ProgressBar>
                    <ProgressFill $percent={percent} />
                  </ProgressBar>
                  <ProgressRow>
                    <ProgressText>{percent}% 달성</ProgressText>
                    <AmountText>{w.current_amount.toLocaleString()}원 / {w.target_amount.toLocaleString()}원</AmountText>
                  </ProgressRow>
                </CardBody>
              </Card>
            );
          })}
        </Grid>
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
  justify-content: space-between;
  margin-bottom: 24px;
`;

const Greeting = styled.h2`
  font-size: 20px;
  font-weight: 700;
`;

const CreateBtn = styled.button`
  padding: 8px 16px;
  background: #ff6b9d;
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`;

const Grid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Card = styled.div`
  border: 1px solid #eee;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: box-shadow 0.2s;
  &:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.08); }
`;

const CardImg = styled.img`
  width: 100%;
  height: 160px;
  object-fit: cover;
`;

const CardBody = styled.div`
  padding: 16px;
`;

const CardTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 12px;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background: #eee;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 8px;
`;

const ProgressFill = styled.div<{ $percent: number }>`
  width: ${({ $percent }) => $percent}%;
  height: 100%;
  background: #ff6b9d;
  border-radius: 3px;
`;

const ProgressRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ProgressText = styled.p`
  font-size: 13px;
  color: #ff6b9d;
  font-weight: 600;
`;

const AmountText = styled.p`
  font-size: 12px;
  color: #aaa;
`;

const Empty = styled.div`
  text-align: center;
  padding: 60px 0;
  color: #888;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

const EmptyIcon = styled.div`
  font-size: 48px;
`;

const Loading = styled.div`
  text-align: center;
  padding: 80px 24px;
  color: #888;
`;
