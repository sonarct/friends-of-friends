const db = require('../database')
const userService = require('./user.service')

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

  test('Search users with query `a` should return correct users', () => {
    return userService.search(1, 'a').then((results) => {
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
  })

  // TODO: Add tests for friend and unfriend
})
