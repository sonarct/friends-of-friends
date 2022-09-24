const port = process.env.NODE_ENV === 'test' ? 3002 : 3001;
const isDev = process.env.NODE_ENV === 'dev';

function init() {
  const app = require("./app");
  const db = require("./database")
  // TODO: uncomment to recreate db each time
  // const user = require("./user.service");

  // user.init().then(() => {
  if (isDev) {
    db.instance.on('profile', (query, time) => {
      console.log('query: `', query, '` \ntime: ', time)
    })
  }

  app.listen(port)
  // });
}

init();
