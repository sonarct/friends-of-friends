const { checkSchema, validationResult } = require('express-validator')

const MAX_ID_LENGTH = 6;
const MAX_QUERY_LENGTH = 32;

const userIdSchema = {
  in: ['params'],
  errorMessage: 'id is incorrect',
  isLength: {
    errorMessage: `user id should be maximum ${MAX_ID_LENGTH} chars long`,
    options: { max: MAX_ID_LENGTH },
  },
  isInt: true,
  toInt: true,
}

const friendIdSchema = {
  in: ['params'],
  errorMessage: 'id is incorrect',
  isLength: {
    errorMessage: `friend id should be maximum ${MAX_ID_LENGTH} chars long`,
    options: { max: MAX_ID_LENGTH },
  },
  isInt: true,
  toInt: true,
}

const querySchema = {
  in: ['params'],
  errorMessage: 'query is missing',
  isLength: {
    errorMessage: `query should be maximum ${MAX_QUERY_LENGTH} chars long`,
    options: { max: MAX_QUERY_LENGTH },
  },
}

const validateFriend = () => checkSchema({
  userId: userIdSchema,
  friendId: friendIdSchema,
})

const validateSearch = () => checkSchema({
  userId: userIdSchema,
  query: querySchema,
})

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next()
}

module.exports = {
  handleValidationErrors,
  validateFriend,
  validateSearch
}
