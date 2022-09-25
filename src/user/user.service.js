const UserRepository = require('./user.repository')

async function addFriend (userId, friendId) {
  const friendRecords = await UserRepository.checkIsFriend(userId, friendId)

  if (friendRecords.length > 0) {
    return
  }

  return await UserRepository.addFriend(userId, friendId)
}

async function removeFriend (userId, friendId) {
  return await UserRepository.removeFriend(userId, friendId)
}

async function search (userId, query) {
  return await UserRepository.search(userId, query)
}

module.exports = {
  addFriend,
  removeFriend,
  search
}
