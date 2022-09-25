const isDev = process.env.NODE_ENV === 'dev'
const isTest = process.env.NODE_ENV === 'test'
const port = isTest ? 3002 : 3001
const app = require('./app')
const db = require('./database')
const UserRepository = require('./user/user.repository')

async function init () {
  await UserRepository.init()

  if (isDev || isTest) {
    db.instance.on('profile', (query, time) => {
      const name = query.slice(0, 32).replaceAll('\n', ' ').trim()
      console.log('query: ', name, '...; time: ', time)
    })
  }

  app.listen(port)
}

init()
