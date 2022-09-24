const express = require('express');

const userController = require('./user.controller');

const router = express.Router();

router.get('/search/:userId/:query', userController.search);
router.get('/friend/:userId/:friendId', userController.friend);
router.get('/unfriend/:userId/:friendId', userController.unfriend);

module.exports = router;