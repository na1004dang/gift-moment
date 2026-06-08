import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AccountCheck from '../pages/auth/AccountCheck';
import KakaoCallback from '../pages/auth/KakaoLogin';
import UserWishList from '../pages/wish/UserWishList';
import MyWishCreate from '../pages/wish/MyWishCreate';
import MyWishDetail from '../pages/wish/MyWishDetail';
import MyWishModify from '../pages/wish/MyWishModify';
import UserWishDetail from '../pages/wish/UserWishDetail';
import GuestLetters from '../pages/letters/GuestLetters';
import PaymentResult from '../pages/price/PaymentResult';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  return localStorage.getItem('token') ? <>{children}</> : <Navigate to="/" replace />;
}

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AccountCheck />} />
        <Route path="/auth/callback" element={<KakaoCallback />} />
        <Route path="/wish/my" element={<PrivateRoute><UserWishList /></PrivateRoute>} />
        <Route path="/wish/create" element={<PrivateRoute><MyWishCreate /></PrivateRoute>} />
        <Route path="/wish/detail" element={<PrivateRoute><MyWishDetail /></PrivateRoute>} />
        <Route path="/wish/modify" element={<PrivateRoute><MyWishModify /></PrivateRoute>} />
        <Route path="/wish/user" element={<UserWishDetail />} />
        <Route path="/letters/:uniqueString" element={<GuestLetters />} />
        <Route path="/payment/result" element={<PaymentResult />} />
      </Routes>
    </BrowserRouter>
  );
}
