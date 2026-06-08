import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { addWishItem } from '../../apis/wishItemApi';

export default function MyWishCreate() {
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({ title: '', description: '', link: '', price: '', bank_name: '', account_number: '' });
  const [preview, setPreview] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      if (file) formData.append('gift_image', file);
      const res = await addWishItem(formData);
      navigate(`/wish/detail?gift_id=${res.data.gift_id}`);
    } catch (err: any) {
      const msg = err?.response?.data?.message || '위시리스트 등록에 실패했습니다.';
      setError(msg);
      console.error('위시 등록 실패:', err?.response?.data || err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container>
      <Header>
        <BackBtn onClick={() => navigate(-1)}>←</BackBtn>
        <h2>위시리스트 만들기</h2>
      </Header>
      <Form onSubmit={handleSubmit}>
        <ImageArea onClick={() => fileRef.current?.click()}>
          {preview ? <PreviewImg src={preview} alt="미리보기" /> : <Placeholder>+ 선물 사진 추가</Placeholder>}
        </ImageArea>
        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
        <Field>
          <label>선물 이름 *</label>
          <Input name="title" value={form.title} onChange={handleChange} placeholder="갖고 싶은 선물을 입력하세요" required />
        </Field>
        <Field>
          <label>내용</label>
          <Textarea name="description" value={form.description} onChange={handleChange} placeholder="선물에 대해 소개해 주세요" rows={4} />
        </Field>
        <Field>
          <label>상품 링크</label>
          <Input name="link" value={form.link} onChange={handleChange} placeholder="https://..." />
        </Field>
        <Field>
          <label>목표 금액 (원) *</label>
          <Input name="price" type="number" value={form.price} onChange={handleChange} placeholder="50000" required />
        </Field>
        <Divider>💳 계좌 정보 (선물 받을 계좌)</Divider>
        <Field>
          <label>은행명</label>
          <Input name="bank_name" value={form.bank_name} onChange={handleChange} placeholder="예: 카카오뱅크" />
        </Field>
        <Field>
          <label>계좌번호</label>
          <Input name="account_number" value={form.account_number} onChange={handleChange} placeholder="예: 3333-01-1234567" />
        </Field>
        {error && <ErrorMsg>⚠️ {error}</ErrorMsg>}
        <Button type="submit" disabled={submitting}>
          {submitting ? '만드는 중...' : '위시리스트 만들기'}
        </Button>
      </Form>
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

const Divider = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: #ff6b9d;
  padding: 8px 0 4px;
  border-top: 1.5px dashed #ffd6e7;
`;

const BackBtn = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ImageArea = styled.div`
  width: 100%;
  height: 200px;
  border: 2px dashed #ddd;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;
  background: #fafafa;
`;

const PreviewImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Placeholder = styled.span`
  color: #aaa;
  font-size: 15px;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  label { font-size: 14px; font-weight: 600; color: #444; }
`;

const Input = styled.input`
  padding: 14px 16px;
  border: 1.5px solid #ddd;
  border-radius: 12px;
  font-size: 16px;
  outline: none;
  &:focus { border-color: #ff6b9d; }
`;

const Textarea = styled.textarea`
  padding: 14px 16px;
  border: 1.5px solid #ddd;
  border-radius: 12px;
  font-size: 16px;
  outline: none;
  resize: vertical;
  &:focus { border-color: #ff6b9d; }
`;

const ErrorMsg = styled.div`
  background: #fff5f5;
  border: 1px solid #fc8181;
  color: #c53030;
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 14px;
`;

const Button = styled.button`
  padding: 14px;
  background: #ff6b9d;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  &:disabled { opacity: 0.6; }
`;
