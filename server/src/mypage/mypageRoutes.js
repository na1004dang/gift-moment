const express = require('express');
const router = express.Router();
const authenticate = require('../../middleware/authenticate');
const pool = require('../../config/database');

router.get('/', authenticate, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, name, email, birth_date FROM members WHERE id = ?', [req.user.id]);
    if (!rows.length) return res.status(404).json({ status: 404, message: '사용자 없음' });
    return res.json({ status: 200, message: '성공', data: rows[0] });
  } catch (err) {
    return res.status(500).json({ status: 500, message: '서버 오류' });
  }
});

module.exports = router;
