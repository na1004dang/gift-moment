const express = require('express');
const router = express.Router();
const controller = require('./letterController');
const authenticate = require('../../middleware/authenticate');

router.post('/create/:uniqueString', controller.createLetter);
router.get('/', authenticate, controller.getMyLetters);
router.get('/copy', authenticate, controller.getLetterLink);
router.get('/guestview/:uniqueString', controller.getGuestLetters);
router.get('/owner/:gift_id', authenticate, controller.getOwnerLetters);
router.get('/:letter_id', authenticate, controller.getLetterById);

module.exports = router;
