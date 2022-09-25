const UserRepository = require('./user.repository')

async function addFriend (userId, friendId) {
  const friendRecords = await UserRepository.getFriendships(userId, friendId)

  if (friendRecords.length > 0) {
    throw new Error('These users are already friends')
  }

  return await UserRepository.addFriend(userId, friendId)
}

async function removeFriend (userId, friendId) {
  return await UserRepository.removeFriend(userId, friendId)
}

async function search (userId, query) {
  const user = await UserRepository.getUser(userId)

  if (!user) {
    throw new Error('User with such id not found')
  }

  return await UserRepository.search(userId, query)
}

module.exports = {
  addFriend,
  removeFriend,
  search
}
