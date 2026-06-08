import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { getMyWishDetail, modifyWishItem } from '../../apis/wishItemApi';

export default function MyWishModify() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const giftId = Number(params.get('gift_id'));
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({ title: '', description: '', link: '', price: '' });
  const [preview, setPreview] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!giftId) return;
    getMyWishDetail(giftId).then((res) => {
      const d = res.data;
      setForm({ title: d.title, description: d.description || '', link: d.link || '', price: String(d.price) });
      setPreview(d.image_url || '');
    }).finally(() => setLoading(false));
  }, [giftId]);

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
    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => formData.append(k, v));
    if (file) formData.append('gift_image', file);
    await modifyWishItem(giftId, formData);
    navigate(`/wish/detail?gift_id=${giftId}`);
  };

  if (loading) return <Loading>불러오는 중...</Loading>;

  return (
    <Container>
      <Header>
        <BackBtn onClick={() => navigate(-1)}>←</BackBtn>
        <h2>위시리스트 수정</h2>
      </Header>
      <Form onSubmit={handleSubmit}>
        <ImageArea onClick={() => fileRef.current?.click()}>
          {preview ? <PreviewImg src={preview} alt="미리보기" /> : <Placeholder>사진 변경 (클릭)</Placeholder>}
        </ImageArea>
        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
        <Field>
          <label>선물 이름</label>
          <Input name="title" value={form.title} onChange={handleChange} required />
        </Field>
        <Field>
          <label>내용</label>
          <Textarea name="description" value={form.description} onChange={handleChange} rows={4} />
        </Field>
        <Field>
          <label>상품 링크</label>
          <Input name="link" value={form.link} onChange={handleChange} />
        </Field>
        <Field>
          <label>목표 금액 (원)</label>
          <Input name="price" type="number" value={form.price} onChange={handleChange} required />
        </Field>
        <Button type="submit">수정 완료</Button>
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
`;

const PreviewImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Placeholder = styled.span`
  color: #aaa;
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

const Button = styled.button`
  padding: 14px;
  background: #ff6b9d;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
`;

const Loading = styled.div`
  text-align: center;
  padding: 80px 24px;
  color: #888;
`;
