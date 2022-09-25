const userService = require('./user.service')

const search = async (req, res) => {
  const { query } = req.params
  // TODO: validate userId. nestjs -> pipe & validator @isString
  const userId = parseInt(req.params.userId)

  userService
    .search(userId, query)
    .then((results) => {
      res.json({
        success: true,
        users: results
      })
    })
    .catch((err) => {
      // TODO: write log with errors and log all errors to console
      console.log(err)
      res.statusCode = 500
      res.json({ success: false, error: err })
    })
}

const friend = async (req, res) => {
  const { userId, friendId } = req.params

  try {
    // TODO: Check if already friends to prevent extra pair creation
    await userService.addFriend(userId, friendId)
    return res.status(200).json({
      success: true
      //  TODO: should return here something?
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ success: false, error: err })
  }
}

const unfriend = async (req, res) => {
  // TODO: Avoid sql injection
  const { userId, friendId } = req.params

  // TODO: Check if already no friends to prevent unnecessary remove call
  userService
    .removeFriend(userId, friendId)
    .then(() => {
      return res.json({
        success: true
        //  TODO: should return here something?
      })
    })
    .catch((err) => {
      res.status(500).json({ success: false, error: err })
    })
}

module.exports.search = search
module.exports.friend = friend
module.exports.unfriend = unfriend
