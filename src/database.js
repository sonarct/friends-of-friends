const sqlite3 = require('sqlite3')

const db = new sqlite3.Database(':memory:')

const run = (query, params) => {
  return new Promise((resolve, reject) => {
    db.run(query, params, (err, results) => {
      if (err) {
        reject(err)
      } else {
        resolve(results)
      }
    })
  })
}

const all = (query, params) => {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, results) => {
      if (err) {
        reject(err)
      } else {
        resolve(results)
      }
    })
  })
}

const get = (query, params) => {
  return new Promise((resolve, reject) => {
    db.get(query, params, (err, row) => {
      if (err) {
        reject(err)
      } else {
        resolve(row)
      }
    })
  })
}

module.exports = {
  run,
  all,
  get,
  instance: db
}
