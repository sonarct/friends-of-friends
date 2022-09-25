const isDev = process.env.NODE_ENV === 'dev'
const isTest = process.env.NODE_ENV === 'test'
const port = isTest ? 3002 : 3001

function init () {
  const app = require('./app')
  const db = require('./database')
  // TODO: uncomment to recreate db each time
  // const user = require("./user.service");

  // user.init().then(() => {
  if (isDev || isTest) {
    db.instance.on('profile', (query, time) => {
      const name = query.slice(0, 32).replaceAll('\n', ' ').trim()
      console.log('query: ', name, '...; time: ', time)
    })
  }

  app.listen(port)
  // });
}

init()
