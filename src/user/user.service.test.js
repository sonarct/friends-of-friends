const db = require('../database')
const userService = require('./user.service')
const userRepository = require('./user.repository')

const users = [
  'admin',
  'awithoutFriends',
  'afriendWithoutFriends',
  'afriendWithFriends',
  'afriendOfFriend',
  'bwithoutFriends',
  'bfriendWithoutFriends',
  'bfriendWithFriends',
  'bfriendOfFriend'
]

const friends = [
  [0, 2],
  [2, 0],
  [3, 4],
  [4, 3],
  [0, 3],
  [3, 0],
  [0, 6],
  [6, 0],
  [0, 7],
  [7, 0],
  [7, 8],
  [8, 7]
]

async function initDB () {
  await db.run('CREATE TABLE Users (id INTEGER PRIMARY KEY AUTOINCREMENT, name varchar(32));')
  await db.run('CREATE TABLE Friends (id INTEGER PRIMARY KEY AUTOINCREMENT, userId int, friendId int);')

  const usersRecords = users.map(u => `('${u}')`).join(', ')
  await db.run(`INSERT INTO Users (name) VALUES ${usersRecords};`)

  const friendRecords = friends.map(f => `(${f[0] + 1}, ${f[1] + 1})`).join(', ')
  await db.run(`INSERT INTO Friends (userId, friendId) VALUES ${friendRecords};`)
}

async function clearDB () {
  await db.run('DROP TABLE Friends;')
  await db.run('DROP TABLE Users;')
}

describe('User Service', () => {
  beforeEach(() => {
    return initDB()
  })

  afterEach(() => {
    return clearDB()
  })

  test('Search users with query `a` should return correct users', async () => {
    const results = await userService.search(1, 'a')
    expect(results).toEqual([
      {
        id: 2,
        name: users[1],
        connection: 0
      },
      {
        id: 3,
        name: users[2],
        connection: 1
      },
      {
        id: 4,
        name: users[3],
        connection: 1
      },
      {
        id: 5,
        name: users[4],
        connection: 2
      }
    ])
  })

  test('Should add friend if users are not friends', async () => {
    const userId = 2
    const friendId = 6
    const friendshipsBefore = await userRepository.getFriendships(userId, friendId)
    expect(friendshipsBefore).toEqual([])
    await userService.addFriend(userId, friendId)
    const friendshipsAfter = await userRepository.getFriendships(userId, friendId)
    expect(friendshipsAfter).toEqual([{ id: 13, userId, friendId }, { id: 14, userId: friendId, friendId: userId }])
  })

  test('Should throw error if add friend while users are already friends', async () => {
    const userId = 4
    const friendId = 5
    const friendshipsBefore = await userRepository.getFriendships(userId, friendId)
    expect(friendshipsBefore).toEqual([{ id: 3, userId, friendId }, { id: 4, userId: friendId, friendId: userId }])
    try {
      await userService.addFriend(userId, friendId)
    } catch (e) {
      expect(e).toEqual(new Error('These users are already friends'))
    }
    const friendshipsAfter = await userRepository.getFriendships(userId, friendId)
    expect(friendshipsAfter).toEqual([{ id: 3, userId, friendId }, { id: 4, userId: friendId, friendId: userId }])
  })

  test('Should remove friend if users are friends', async () => {
    const userId = 4
    const friendId = 5
    const friendshipsBefore = await userRepository.getFriendships(userId, friendId)
    expect(friendshipsBefore).toEqual([{ id: 3, userId, friendId }, { id: 4, userId: friendId, friendId: userId }])
    await userService.removeFriend(userId, friendId)
    const friendshipsAfter = await userRepository.getFriendships(userId, friendId)
    expect(friendshipsAfter).toEqual([])
  })

  test('Search should throw error if there is no such user', async () => {
    const userId = 77
    try {
      await userService.search(userId, 'a')
    } catch (e) {
      expect(e).toEqual(new Error('User with such id not found'))
    }
  })
})
