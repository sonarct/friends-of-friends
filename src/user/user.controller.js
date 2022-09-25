const userService = require('./user.service')

const search = async (req, res) => {
  const { query, userId } = req.params

  try {
    const results = await userService.search(userId, query)
    return res.status(200).json({
      success: true,
      users: results
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({ success: false, error: err })
  }
}

const friend = async (req, res) => {
  const { userId, friendId } = req.params

  try {
    await userService.addFriend(userId, friendId)
    return res.status(200).json({
      success: true
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ success: false, error: err })
  }
}

const unfriend = async (req, res) => {
  const { userId, friendId } = req.params

  try {
    await userService.removeFriend(userId, friendId)
    return res.status(200).json({
      success: true
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ success: false, error: err })
  }
}

module.exports.search = search
module.exports.friend = friend
module.exports.unfriend = unfriend
