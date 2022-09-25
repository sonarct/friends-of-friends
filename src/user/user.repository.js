const db = require('../database')

function search (userId, query) {
  return db.all(`
    SELECT 
      u.id,
      u.name,
    CASE
      WHEN EXISTS (
        SELECT friendId FROM Friends WHERE userId = $userId AND friendId = u.id
      ) THEN 1
      WHEN EXISTS (
        SELECT ff.friendId FROM Friends AS f
        LEFT JOIN Friends AS ff ON f.friendId = ff.userId
        WHERE f.userId = $userId AND ff.friendId = u.id
      ) THEN 2
      WHEN EXISTS (
        SELECT fff.friendId FROM Friends AS f
        LEFT JOIN Friends AS ff ON f.friendId = ff.userId
        LEFT JOIN Friends AS fff ON ff.friendId = fff.userId
        WHERE f.userId = $userId AND fff.friendId = u.id
      ) THEN 3
--      WHEN EXISTS (
--        SELECT ffff.friendId FROM Friends as f
--        LEFT JOIN Friends as ff on f.friendId = ff.userId
--       LEFT JOIN Friends as fff on ff.friendId = fff.userId
--        LEFT JOIN Friends as ffff on fff.friendId = ffff.userId
--        WHERE f.userId = $userId AND ffff.friendId = u.id
--      ) THEN 4
      ELSE 0
    END AS connection
    FROM
      Users AS u
    WHERE
      u.name LIKE $query
      AND u.id <> $userId
    LIMIT 20;
`, {
    $query: `${query}%`,
    $userId: userId
  })
}

function getUser (userId) {
  return db.get(
    'SELECT * FROM Users WHERE id = $userId;',
    { $userId: userId }
  )
}

function addFriend (userId, friendId) {
  return db.run(
    'INSERT INTO Friends (userId, friendId) VALUES ($userId, $friendId), ($friendId, $userId);',
    {
      $userId: userId,
      $friendId: friendId
    }
  )
}

function getFriendships (userId, friendId) {
  return db.all(
    'SELECT * FROM Friends WHERE (userId = $userId AND friendId = $friendId) OR (userId = $friendId AND friendId = $userId);',
    {
      $userId: userId,
      $friendId: friendId
    }
  )
}

function removeFriend (userId, friendId) {
  return db.run(
    'DELETE FROM Friends WHERE (userId=$userId AND friendId=$friendId) OR (userId=$friendId AND friendId=$userId);',
    {
      $userId: userId,
      $friendId: friendId
    }
  )
}

async function init () {
  await db.run(
    'CREATE TABLE Users (id INTEGER PRIMARY KEY AUTOINCREMENT, name varchar(32));'
  )
  await db.run(
    'CREATE TABLE Friends (id INTEGER PRIMARY KEY AUTOINCREMENT, userId int, friendId int);'
  )
  const users = []
  const names = ['foo', 'bar', 'baz']
  for (let i = 0; i < 27000; ++i) {
    let n = i
    let name = ''
    for (let j = 0; j < 3; ++j) {
      name += names[n % 3]
      n = Math.floor(n / 3)
      name += n % 10
      n = Math.floor(n / 10)
    }
    users.push(name)
  }
  const friends = users.map(() => [])
  for (let i = 0; i < friends.length; ++i) {
    const n = 10 + Math.floor(90 * Math.random())
    const list = [...Array(n)].map(() =>
      Math.floor(friends.length * Math.random())
    )
    list.forEach((j) => {
      if (i === j) {
        return
      }
      if (friends[i].indexOf(j) >= 0 || friends[j].indexOf(i) >= 0) {
        return
      }
      friends[i].push(j)
      friends[j].push(i)
    })
  }
  console.log('Init Users Table...')
  await Promise.all(users.map((un) => db.run(`INSERT INTO Users (name) VALUES ('${un}');`)))
  // Create unique index for user name assuming that we have only unique names.
  await db.run('CREATE UNIQUE INDEX idx_users_name ON Users(name);')

  console.log('Init Friends Table...')

  await Promise.all(friends.map((list, i) => {
    return Promise.all(list.map((j) => db.run(`INSERT INTO Friends (userId, friendId) VALUES (${i + 1}, ${j + 1});`)))
  }))
  // Create indexes for both friendId and userId columns.
  await db.run('CREATE INDEX idx_friends_friendId ON Friends(friendId);')
  await db.run('CREATE INDEX idx_friends_userId ON Friends(userId);')
  console.log('Ready.')
}

module.exports = {
  search,
  addFriend,
  removeFriend,
  getFriendships,
  getUser,
  init
}
