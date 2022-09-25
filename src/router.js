const express = require('express')
const { validateFriend, handleValidationErrors, validateSearch } = require('./user/user.validator')
const userController = require('./user/user.controller')

const router = express.Router()

router.get('/search/:userId/:query',
  validateSearch(),
  handleValidationErrors,
  userController.search)

router.get(
  '/friend/:userId/:friendId',
  validateFriend(),
  handleValidationErrors,
  userController.friend
)

router.get(
  '/unfriend/:userId/:friendId',
  validateFriend(),
  handleValidationErrors,
  userController.unfriend
)

module.exports = router
