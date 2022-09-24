const db = require('./database')

function search(userId, query) {
  return db.all(`SELECT DISTINCT u.id,
                u.name, -- ff.friendId AS ffId, f.friendId AS fId,
    CASE
      WHEN ${userId} = f.friendId THEN 2
      WHEN ${userId} = ff.friendId THEN 1
      ELSE 0
    END AS connection
    FROM
      Users as u
      LEFT JOIN Friends as ff on u.id = ff.userId
      LEFT JOIN Friends as f on ff.friendId = f.userId
--                                     AND ff.friendId = ${userId}
    -- WHERE
    -- u.id = 1
    WHERE
      name LIKE '${query}%'
      AND u.id <> ${userId}
--     LIMIT 10
--       AND ff.friendId NOT IN
--         (SELECT friendId FROM Friends WHERE userId = ${userId})
    -- ORDER BY f.friendId
;`)
}

// db.all(`SELECT id, name, id in (SELECT friendId from Friends where userId = ${userId}) as connection from Users where name LIKE '${query}%' LIMIT 20;`).then((results) => {
//   res.statusCode = 200;
//   res.json({
//     success: true,
//     users: results
//   });
// }).catch((err) => {
//   res.statusCode = 500;
//   res.json({ success: false, error: err });
// });

function friend(userId, friendId) {
  return db.run(`INSERT INTO friends (userid, friendid) VALUES (${userId}, ${friendId}), (${friendId}, ${userId});`)
}

function unfriend(userId, friendId) {
  return db.run(`DELETE FROM friends WHERE (userId=${userId} AND friendId=${friendId}) OR (userId=${friendId} AND friendId=${userId});`)
}

async function init () {
  await db.run('CREATE TABLE Users (id INTEGER PRIMARY KEY AUTOINCREMENT, name varchar(32));');
  await db.run('CREATE TABLE Friends (id INTEGER PRIMARY KEY AUTOINCREMENT, userId int, friendId int);');
  const users = [];
  const names = ['foo', 'bar', 'baz'];
  for (i = 0; i < 10; ++i) {
    let n = i;
    let name = '';
    for (j = 0; j < 3; ++j) {
      name += names[n % 3];
      n = Math.floor(n / 3);
      name += n % 10;
      n = Math.floor(n / 10);
    }
    users.push(name);
  }
  const friends = users.map(() => []);
  for (i = 0; i < friends.length; ++i) {
    const n = 1 + Math.floor(4 * Math.random());
    const list = [...Array(n)].map(() => Math.floor(friends.length * Math.random()));
    list.forEach((j) => {
      if (i === j) {
        return;
      }
      if (friends[i].indexOf(j) >= 0 || friends[j].indexOf(i) >= 0) {
        return;
      }
      friends[i].push(j);
      friends[j].push(i);
    });
  }
  console.log("Init Users Table...");
  await Promise.all(users.map((un) => db.run(`INSERT INTO Users (name) VALUES ('${un}');`)));
  console.log("Init Friends Table...");
  await Promise.all(friends.map((list, i) => {
    Promise.all(list.map((j) => db.run(`INSERT INTO Friends (userId, friendId) VALUES (${i + 1}, ${j + 1});`)));
  }));
  console.log("Ready.");
}

module.exports = {
  search: search,
  friend: friend,
  unfriend: unfriend,
  init: init
}

// SELECT
//   id,
//   name,
//   id IN (SELECT friendId FROM Friends WHERE userId = ${userId}) AS connection

//   FROM Users

//   WHERE name LIKE '${query}%' // Ищу всех foo
//   LIMIT 20;



// SELECT
// u.id, u.name, f.friendId, f.userId
// FROM
// Users as u
// INNER JOIN Friends as ff on u.id = ff.friendId
// INNER JOIN Friends as f on ff.userId = f.friendId
// WHERE
// -- u.id = 1
// WHERE name LIKE '${query}%'
// AND ff.friendId NOT IN
// (SELECT friendId FROM Friends WHERE userId = u.id)
// ORDER BY f.friendId;
