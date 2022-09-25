const sqlite3 = require('sqlite3');

let db

switch(process.env.NODE_ENV) {
  case 'dev':
    db = new sqlite3.Database('db.sqlite');
    break;
  case 'prod':
  case 'test':
  default:
    db = new sqlite3.Database(':memory:');
}

const run = (query, params) => {
  return new Promise((resolve, reject) => {
    db.run(query, params, (err, results) => {
      if (err) {
        reject(err)
      } else {
        resolve(results);
      }
    });
  });
}

const all = (query, params) => {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, results) => {
      if (err) {
        reject(err)
      } else {
        resolve(results);
      }
    });
  });
}

module.exports.run = run;
module.exports.all = all;
module.exports.instance = db