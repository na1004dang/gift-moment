const pool = require('../../config/database');
const crypto = require('crypto');

exports.createLetter = async (req, res) => {
  try {
    const { uniqueString } = req.params;
    const { sender_name, content, amount } = req.body;

    // uniqueString으로 gift 조회
    const [giftRows] = await pool.query(
      'SELECT gift_id FROM letters WHERE unique_string = ? LIMIT 1',
      [uniqueString]
    );

    let giftId;
    if (giftRows.length) {
      giftId = giftRows[0].gift_id;
    } else {
      // 새로운 unique_string이면 gift_id=null로 처리할 수 없으니 오류
      return res.status(404).json({ status: 404, message: '유효하지 않은 링크입니다.' });
    }

    await pool.query(
      'INSERT INTO letters (gift_id, unique_string, sender_name, content, amount) VALUES (?, ?, ?, ?, ?)',
      [giftId, uniqueString, sender_name, content, parseInt(amount) || 0]
    );

    // current_amount 업데이트
    await pool.query(
      'UPDATE gifts SET current_amount = (SELECT COALESCE(SUM(amount),0) FROM letters WHERE gift_id = ?) WHERE id = ?',
      [giftId, giftId]
    );

    return res.json({ status: 200, message: '편지 전송 완료' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: 500, message: '서버 오류' });
  }
};

exports.getMyLetters = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT l.* FROM letters l
       JOIN gifts g ON l.gift_id = g.id
       WHERE g.member_id = ?
       ORDER BY l.created_at DESC`,
      [req.user.id]
    );
    return res.json({ status: 200, message: '성공', data: rows });
  } catch (err) {
    return res.status(500).json({ status: 500, message: '서버 오류' });
  }
};

exports.getLetterLink = async (req, res) => {
  try {
    const { gift_id } = req.query;
    if (!gift_id) return res.status(400).json({ status: 400, message: 'gift_id가 필요합니다.' });

    // 이미 존재하는 unique_string 확인
    const [existing] = await pool.query(
      'SELECT unique_string FROM letters WHERE gift_id = ? LIMIT 1',
      [gift_id]
    );

    if (existing.length) {
      return res.json({ status: 200, message: '성공', data: { unique_string: existing[0].unique_string } });
    }

    // 새 unique_string 생성 (letters 테이블에 placeholder 없이 gift와 연결할 string만 발급)
    const uniqueString = crypto.randomBytes(8).toString('hex');
    // 임시 레코드 삽입으로 unique_string을 gift_id에 연결
    await pool.query(
      'INSERT INTO letters (gift_id, unique_string, sender_name, content, amount) VALUES (?, ?, ?, ?, ?)',
      [gift_id, uniqueString, '__system__', '__link_generated__', 0]
    );

    return res.json({ status: 200, message: '성공', data: { unique_string: uniqueString } });
  } catch (err) {
    return res.status(500).json({ status: 500, message: '서버 오류' });
  }
};

exports.getGuestLetters = async (req, res) => {
  try {
    const { uniqueString } = req.params;
    const [rows] = await pool.query(
      `SELECT id, sender_name, content, amount, created_at
       FROM letters
       WHERE unique_string = ? AND sender_name != '__system__'
       ORDER BY created_at DESC`,
      [uniqueString]
    );
    const totalAmount = rows.reduce((sum, l) => sum + (l.amount || 0), 0);
    return res.json({ status: 200, message: '성공', data: { letters: rows, total_amount: totalAmount } });
  } catch (err) {
    return res.status(500).json({ status: 500, message: '서버 오류' });
  }
};

// 위시 주인 전용 - 풀네임으로 편지 조회 (인증 필요)
exports.getOwnerLetters = async (req, res) => {
  try {
    const { gift_id } = req.params;
    // 본인 소유 확인
    const [giftRows] = await pool.query(
      'SELECT id FROM gifts WHERE id = ? AND member_id = ?',
      [gift_id, req.user.id]
    );
    if (!giftRows.length) {
      return res.status(403).json({ status: 403, message: '접근 권한이 없습니다.' });
    }
    const [rows] = await pool.query(
      `SELECT id, sender_name, content, amount, created_at
       FROM letters
       WHERE gift_id = ? AND sender_name != '__system__'
       ORDER BY created_at DESC`,
      [gift_id]
    );
    const totalAmount = rows.reduce((sum, l) => sum + (l.amount || 0), 0);
    return res.json({ status: 200, message: '성공', data: { letters: rows, total_amount: totalAmount } });
  } catch (err) {
    return res.status(500).json({ status: 500, message: '서버 오류' });
  }
};

exports.getLetterById = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM letters WHERE id = ?', [req.params.letter_id]);
    if (!rows.length) return res.status(404).json({ status: 404, message: '없습니다.' });
    return res.json({ status: 200, message: '성공', data: rows[0] });
  } catch (err) {
    return res.status(500).json({ status: 500, message: '서버 오류' });
  }
};
