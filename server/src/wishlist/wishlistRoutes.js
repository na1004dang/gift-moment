const express = require('express');
const router = express.Router();
const controller = require('./wishlistController');
const authenticate = require('../../middleware/authenticate');

// Cloudinary 설정이 있으면 클라우드 업로드, 없으면 메모리 저장
let upload;
if (process.env.CLOUDINARY_CLOUD_NAME) {
  const { upload: cloudUpload } = require('../../config/cloudinary');
  upload = cloudUpload;
} else {
  const multer = require('multer');
  upload = multer({ storage: multer.memoryStorage() });
}

router.post('/', authenticate, upload.single('gift_image'), controller.addWishlist);
router.get('/member/birthday', authenticate, controller.getWishlistByBirthday);
router.get('/giver/bylink', controller.getWishlistByLink);
router.get('/member/gift', authenticate, controller.getGiftDetailForMember);
router.get('/giver/gift', authenticate, controller.getGiftDetailForGiver);
router.get('/:gift_id', controller.getWishlistById);
router.patch('/:gift_id', authenticate, upload.single('gift_image'), controller.updateWishlist);
router.delete('/:gift_id', authenticate, controller.deleteWishlist);

module.exports = router;
