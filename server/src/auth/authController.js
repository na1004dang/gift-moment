const axios = require('axios');
const jwt = require('jsonwebtoken');
const pool = require('../../config/database');

const generateToken = (id, email) =>
  jwt.sign({ id, email }, process.env.JWT_SECRET, { expiresIn: '7d' });

// code → 카카오 토큰 교환 → 유저 정보 조회 (백엔드에서 처리)
exports.kakaoLoginWithCode = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ status: 400, message: 'code가 없습니다.' });

    // 1. code → access_token 교환 (클라이언트 시크릿 포함)
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: process.env.KAKAO_REST_API_KEY,
      redirect_uri: process.env.KAKAO_REDIRECT_URI,
      code,
      ...(process.env.KAKAO_CLIENT_SECRET && { client_secret: process.env.KAKAO_CLIENT_SECRET }),
    });

    const tokenRes = await axios.post('https://kauth.kakao.com/oauth/token', params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    const accessToken = tokenRes.data.access_token;

    // 2. access_token → 카카오 유저 정보 조회
    const { data: kakaoUser } = await axios.get('https://kapi.kakao.com/v2/user/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const kakaoId = String(kakaoUser.id);
    const email = kakaoUser.kakao_account?.email || null;
    const name = kakaoUser.kakao_account?.profile?.nickname || '사용자';

    const [rows] = await pool.query('SELECT * FROM members WHERE kakao_id = ?', [kakaoId]);
    let user;
    if (rows.length === 0) {
      const [result] = await pool.query(
        'INSERT INTO members (kakao_id, email, name) VALUES (?, ?, ?)',
        [kakaoId, email, name]
      );
      user = { id: result.insertId, email, name };
    } else {
      user = rows[0];
    }

    const token = generateToken(user.id, user.email);
    return res.json({ status: 200, message: '로그인 성공', data: { token, user_id: user.id, name: user.name } });
  } catch (err) {
    console.error('kakaoLoginWithCode error:', err?.response?.data || err.message);
    return res.status(500).json({ status: 500, message: '로그인 실패', detail: err?.response?.data });
  }
};

exports.kakaoLogin = async (req, res) => {
  try {
    const { accessToken } = req.body;
    const { data: kakaoUser } = await axios.get('https://kapi.kakao.com/v2/user/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const kakaoId = String(kakaoUser.id);
    const email = kakaoUser.kakao_account?.email || null;
    const name = kakaoUser.kakao_account?.profile?.nickname || '사용자';

    const [rows] = await pool.query('SELECT * FROM members WHERE kakao_id = ?', [kakaoId]);
    let user;
    if (rows.length === 0) {
      const [result] = await pool.query(
        'INSERT INTO members (kakao_id, email, name) VALUES (?, ?, ?)',
        [kakaoId, email, name]
      );
      user = { id: result.insertId, email };
    } else {
      user = rows[0];
    }

    const token = generateToken(user.id, user.email);
    return res.json({ status: 200, message: '로그인 성공', data: { token, user_id: user.id, name: user.name } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: 500, message: '로그인 실패' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, email, name, birth_date FROM members WHERE id = ?', [req.user.id]);
    if (!rows.length) return res.status(404).json({ status: 404, message: '사용자 없음' });
    return res.json({ status: 200, message: '성공', data: rows[0] });
  } catch (err) {
    return res.status(500).json({ status: 500, message: '서버 오류' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, email, birth_date } = req.body;
    const fields = [];
    const values = [];
    if (name) { fields.push('name = ?'); values.push(name); }
    if (email) { fields.push('email = ?'); values.push(email); }
    if (birth_date) { fields.push('birth_date = ?'); values.push(birth_date); }
    if (!fields.length) return res.status(400).json({ status: 400, message: '수정할 필드가 없습니다.' });
    values.push(req.user.id);
    await pool.query(`UPDATE members SET ${fields.join(', ')} WHERE id = ?`, values);
    return res.json({ status: 200, message: '수정 완료' });
  } catch (err) {
    return res.status(500).json({ status: 500, message: '서버 오류' });
  }
};

exports.getNavigateInfo = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT name, birth_date FROM members WHERE id = ?', [req.user.id]);
    if (!rows.length) return res.status(404).json({ status: 404, message: '사용자 없음' });
    const { name, birth_date } = rows[0];
    const today = new Date();
    const bday = birth_date ? new Date(birth_date) : null;
    const isBirthday = bday && bday.getMonth() === today.getMonth() && bday.getDate() === today.getDate();
    return res.json({ status: 200, message: '성공', data: { name, birth_date, is_birthday: isBirthday } });
  } catch (err) {
    return res.status(500).json({ status: 500, message: '서버 오류' });
  }
};

exports.logout = (req, res) => {
  return res.json({ status: 200, message: '로그아웃 성공' });
};
