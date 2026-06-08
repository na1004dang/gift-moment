import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { addLetter, getGuestLetters } from '../../apis/guestLetterApi';
import { getWishByLink } from '../../apis/wishItemApi';
import type { LetterItem } from '../../types/api';

export default function GuestLetters() {
  const navigate = useNavigate();
  const { uniqueString } = useParams<{ uniqueString: string }>();
  const [letters, setLetters] = useState<LetterItem[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ sender_name: '', content: '', amount: '' });
  const [submitting, setSubmitting] = useState(false);
  const [ownerName, setOwnerName] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');

  useEffect(() => {
    if (!uniqueString) return;
    getWishByLink(uniqueString)
      .then((res) => {
        setOwnerName(res.data.owner_name || '');
        setBankName(res.data.bank_name || '');
        setAccountNumber(res.data.account_number || '');
      })
      .catch(() => {});
  }, [uniqueString]);

  const loadLetters = () => {
    if (!uniqueString) return;
    getGuestLetters(uniqueString).then((res) => {
      setLetters(res.data.letters);
      setTotalAmount(res.data.total_amount);
    });
  };

  useEffect(() => {
    loadLetters();
  }, [uniqueString]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uniqueString || submitting) return;
    setSubmitting(true);
    try {
      await addLetter(uniqueString, {
        sender_name: form.sender_name,
        content: form.content,
        amount: Number(form.amount),
      });
      // 편지 전송 성공 → 결제 페이지로 이동
      const query = new URLSearchParams({
        amount: form.amount,
        sender: form.sender_name,
        unique: uniqueString,
        owner: ownerName,
        bank: bankName,
        account: accountNumber,
      });
      navigate(`/payment/result?${query.toString()}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container>
      <Header>
        <BackBtn onClick={() => navigate(-1)}>←</BackBtn>
        <h2>선물 & 편지</h2>
      </Header>
      <TotalBox>
        <TotalLabel>총 모인 금액</TotalLabel>
        <TotalAmount>{totalAmount.toLocaleString()}원</TotalAmount>
      </TotalBox>
      <SendBtn onClick={() => setShowForm(!showForm)}>
        {showForm ? '취소' : '편지 쓰기'}
      </SendBtn>
      {showForm && (
        <Form onSubmit={handleSubmit}>
          <Field>
            <label>보내는 사람</label>
            <Input
              value={form.sender_name}
              onChange={(e) => setForm({ ...form, sender_name: e.target.value })}
              placeholder="이름을 입력하세요"
              required
            />
          </Field>
          <Field>
            <label>편지 내용</label>
            <Textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder="따뜻한 편지를 써주세요 ✉️"
              rows={5}
              required
            />
          </Field>
          <Field>
            <label>선물 금액 (원)</label>
            <Input
              type="number"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              placeholder="10000"
              min={0}
              required
            />
          </Field>
          <SubmitBtn type="submit" disabled={submitting}>
            {submitting ? '전송 중...' : '보내기'}
          </SubmitBtn>
        </Form>
      )}
      <LetterList>
        {letters.length === 0 ? (
          <Empty>아직 편지가 없어요. 첫 편지를 보내보세요!</Empty>
        ) : (
          letters.map((l) => {
            // 이름 모자이크: 첫 글자만 보이고 나머지 blur
            const name = l.sender_name;
            const visiblePart = name.length > 0 ? name[0] : '?';
            const hiddenPart = name.length > 1 ? name.slice(1) : '';
            return (
              <LetterCard key={l.id}>
                <LetterHeader>
                  <SenderNameRow>
                    <VisibleName>{visiblePart}</VisibleName>
                    {hiddenPart && <BlurredName>{hiddenPart}</BlurredName>}
                  </SenderNameRow>
                  <Amount>{l.amount.toLocaleString()}원</Amount>
                </LetterHeader>
                <LetterContent>{l.content}</LetterContent>
                <LetterDate>{new Date(l.created_at).toLocaleDateString('ko-KR')}</LetterDate>
              </LetterCard>
            );
          })
        )}
      </LetterList>
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

const TotalBox = styled.div`
  background: #fff0f6;
  border-radius: 16px;
  padding: 20px;
  text-align: center;
  margin-bottom: 20px;
`;

const TotalLabel = styled.p`
  font-size: 14px;
  color: #888;
  margin-bottom: 8px;
`;

const TotalAmount = styled.p`
  font-size: 28px;
  font-weight: 700;
  color: #ff6b9d;
`;

const SendBtn = styled.button`
  width: 100%;
  padding: 14px;
  background: #ff6b9d;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 20px;
`;

const Form = styled.form`
  background: #fafafa;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  label { font-size: 14px; font-weight: 600; color: #444; }
`;

const Input = styled.input`
  padding: 12px 14px;
  border: 1.5px solid #ddd;
  border-radius: 10px;
  font-size: 15px;
  outline: none;
  &:focus { border-color: #ff6b9d; }
`;

const Textarea = styled.textarea`
  padding: 12px 14px;
  border: 1.5px solid #ddd;
  border-radius: 10px;
  font-size: 15px;
  outline: none;
  resize: vertical;
  &:focus { border-color: #ff6b9d; }
`;

const SubmitBtn = styled.button`
  padding: 12px;
  background: #ff6b9d;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  &:disabled { opacity: 0.6; }
`;

const LetterList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const LetterCard = styled.div`
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 16px;
`;

const LetterHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const SenderNameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1px;
`;

const VisibleName = styled.span`
  font-weight: 700;
  font-size: 15px;
`;

const BlurredName = styled.span`
  font-weight: 700;
  font-size: 15px;
  filter: blur(6px);
  user-select: none;
  color: #333;
`;

const Amount = styled.span`
  color: #ff6b9d;
  font-weight: 600;
  font-size: 14px;
`;

const LetterContent = styled.p`
  color: #444;
  line-height: 1.6;
  font-size: 14px;
  margin-bottom: 8px;
`;

const LetterDate = styled.p`
  color: #aaa;
  font-size: 12px;
`;

const Empty = styled.p`
  text-align: center;
  color: #aaa;
  padding: 40px 0;
`;
