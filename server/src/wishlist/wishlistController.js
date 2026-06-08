const pool = require('../../config/database');
const path = require('path');

const imageUrl = (filename) =>
  filename ? `${process.env.BACKEND_URL || 'http://localhost:3000'}/uploads/${filename}` : null;

exports.addWishlist = async (req, res) => {
  try {
    const { title, description, link, price, bank_name, account_number } = req.body;
    const memberId = req.user.id;

    const [countRows] = await pool.query('SELECT COUNT(*) as cnt FROM gifts WHERE member_id = ?', [memberId]);
    if (countRows[0].cnt >= 5) {
      return res.status(400).json({ status: 400, message: '최대 5개까지 등록할 수 있습니다.' });
    }

    const imgUrl = req.file ? imageUrl(req.file.filename) : null;
    const targetAmount = parseInt(price) || 0;

    // 기본 INSERT (bank 컬럼 제외)
    const [result] = await pool.query(
      'INSERT INTO gifts (member_id, title, description, link, price, target_amount, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [memberId, title, description, link, targetAmount, targetAmount, imgUrl]
    );
    const giftId = result.insertId;

    // 계좌 정보 UPDATE (컬럼 없으면 무시)
    if (bank_name || account_number) {
      await pool.query(
        'UPDATE gifts SET bank_name = ?, account_number = ? WHERE id = ?',
        [bank_name || null, account_number || null, giftId]
      ).catch(() => {});
    }

    return res.json({ status: 200, message: '위시리스트 등록 완료', data: { gift_id: giftId } });
  } catch (err) {
    console.error('addWishlist error:', err.message);
    return res.status(500).json({ status: 500, message: '서버 오류', detail: err.message });
  }
};

exports.getWishlistByBirthday = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT g.*, m.name as owner_name FROM gifts g JOIN members m ON g.member_id = m.id WHERE g.member_id = ?',
      [req.user.id]
    );
    return res.json({ status: 200, message: '성공', data: rows });
  } catch (err) {
    return res.status(500).json({ status: 500, message: '서버 오류' });
  }
};

exports.getWishlistByLink = async (req, res) => {
  try {
    const { unique_string } = req.query;
    const [letters] = await pool.query('SELECT gift_id FROM letters WHERE unique_string = ? LIMIT 1', [unique_string]);
    if (!letters.length) return res.status(404).json({ status: 404, message: '없는 링크입니다.' });
    const [rows] = await pool.query(
      'SELECT g.*, m.name as owner_name, m.birth_date FROM gifts g JOIN members m ON g.member_id = m.id WHERE g.id = ?',
      [letters[0].gift_id]
    );
    if (!rows.length) return res.status(404).json({ status: 404, message: '선물이 없습니다.' });
    return res.json({ status: 200, message: '성공', data: rows[0] });
  } catch (err) {
    return res.status(500).json({ status: 500, message: '서버 오류' });
  }
};

exports.getWishlistById = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT g.*, m.name as owner_name FROM gifts g JOIN members m ON g.member_id = m.id WHERE g.id = ?',
      [req.params.gift_id]
    );
    if (!rows.length) return res.status(404).json({ status: 404, message: '없습니다.' });
    return res.json({ status: 200, message: '성공', data: rows[0] });
  } catch (err) {
    return res.status(500).json({ status: 500, message: '서버 오류' });
  }
};

exports.getGiftDetailForMember = async (req, res) => {
  try {
    const { gift_id } = req.query;
    const [rows] = await pool.query(
      `SELECT g.*, COALESCE(SUM(l.amount),0) as collected_amount,
        CASE WHEN g.target_amount > 0 THEN ROUND(COALESCE(SUM(l.amount),0)/g.target_amount*100) ELSE 0 END as percent
       FROM gifts g LEFT JOIN letters l ON l.gift_id = g.id
       WHERE g.id = ? AND g.member_id = ? GROUP BY g.id`,
      [gift_id, req.user.id]
    );
    if (!rows.length) return res.status(404).json({ status: 404, message: '없습니다.' });
    return res.json({ status: 200, message: '성공', data: rows[0] });
  } catch (err) {
    return res.status(500).json({ status: 500, message: '서버 오류' });
  }
};

exports.getGiftDetailForGiver = async (req, res) => {
  try {
    const { gift_id } = req.query;
    const [rows] = await pool.query(
      `SELECT g.*, COALESCE(SUM(l.amount),0) as collected_amount,
        CASE WHEN g.target_amount > 0 THEN ROUND(COALESCE(SUM(l.amount),0)/g.target_amount*100) ELSE 0 END as percent,
        ? as giver_id
       FROM gifts g LEFT JOIN letters l ON l.gift_id = g.id
       WHERE g.id = ? GROUP BY g.id`,
      [req.user.id, gift_id]
    );
    if (!rows.length) return res.status(404).json({ status: 404, message: '없습니다.' });
    return res.json({ status: 200, message: '성공', data: rows[0] });
  } catch (err) {
    return res.status(500).json({ status: 500, message: '서버 오류' });
  }
};

exports.updateWishlist = async (req, res) => {
  try {
    const { gift_id } = req.params;
    const { description, link, title, price, bank_name, account_number } = req.body;
    const [existing] = await pool.query('SELECT * FROM gifts WHERE id = ? AND member_id = ?', [gift_id, req.user.id]);
    if (!existing.length) return res.status(404).json({ status: 404, message: '없습니다.' });

    const imgUrl = req.file ? imageUrl(req.file.filename) : existing[0].image_url;
    await pool.query(
      'UPDATE gifts SET title=?, description=?, link=?, image_url=?, price=?, target_amount=? WHERE id=?',
      [
        title || existing[0].title,
        description || existing[0].description,
        link || existing[0].link,
        imgUrl,
        price || existing[0].price,
        price || existing[0].target_amount,
        gift_id,
      ]
    );
    // 계좌 정보 별도 UPDATE (컬럼 없으면 무시)
    if (bank_name !== undefined || account_number !== undefined) {
      await pool.query(
        'UPDATE gifts SET bank_name=?, account_number=? WHERE id=?',
        [
          bank_name !== undefined ? bank_name : existing[0].bank_name,
          account_number !== undefined ? account_number : existing[0].account_number,
          gift_id,
        ]
      ).catch(() => {});
    }
    return res.json({ status: 200, message: '수정 완료' });
  } catch (err) {
    return res.status(500).json({ status: 500, message: '서버 오류' });
  }
};

exports.deleteWishlist = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM gifts WHERE id = ? AND member_id = ?', [req.params.gift_id, req.user.id]);
    if (!rows.length) return res.status(404).json({ status: 404, message: '없습니다.' });
    await pool.query('DELETE FROM gifts WHERE id = ?', [req.params.gift_id]);
    return res.json({ status: 200, message: '삭제 완료' });
  } catch (err) {
    return res.status(500).json({ status: 500, message: '서버 오류' });
  }
};
