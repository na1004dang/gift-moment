const express = require('express');
const router = express.Router();
const authController = require('./authController');
const authenticate = require('../../middleware/authenticate');

router.post('/kakao/code', authController.kakaoLoginWithCode);
router.post('/kakao', authController.kakaoLogin);
router.get('/profile', authenticate, authController.getProfile);
router.patch('/profile', authenticate, authController.updateProfile);
router.get('/navigate', authenticate, authController.getNavigateInfo);
router.post('/logout', authenticate, authController.logout);

module.exports = router;
