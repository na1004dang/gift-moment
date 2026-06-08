require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./src/auth/authRoutes');
const wishlistRoutes = require('./src/wishlist/wishlistRoutes');
const letterRoutes = require('./src/letters/letterRoutes');
const mypageRoutes = require('./src/mypage/mypageRoutes');

const app = express();

app.use(cors({
  origin: [process.env.FRONT_DOMAIN || 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/wishlists', wishlistRoutes);
app.use('/api/v1/letters', letterRoutes);
app.use('/api/v1/mypage', mypageRoutes);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
