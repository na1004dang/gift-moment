const express = require('express');
const router = express.Router();
const controller = require('./wishlistController');
const authenticate = require('../../middleware/authenticate');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

router.post('/', authenticate, upload.single('gift_image'), controller.addWishlist);
router.get('/member/birthday', authenticate, controller.getWishlistByBirthday);
router.get('/giver/bylink', controller.getWishlistByLink);
router.get('/member/gift', authenticate, controller.getGiftDetailForMember);
router.get('/giver/gift', authenticate, controller.getGiftDetailForGiver);
router.get('/:gift_id', controller.getWishlistById);
router.patch('/:gift_id', authenticate, upload.single('gift_image'), controller.updateWishlist);
router.delete('/:gift_id', authenticate, controller.deleteWishlist);

module.exports = router;
