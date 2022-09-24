const port = process.env.NODE_ENV === 'test' ? 3002 : 3001;
const isDev = process.env.NODE_ENV === 'dev';

const profile = () => {
}
module.exports.profile = profile

function init() {
  const app = require("./app");
  const db = require("./database")
  // const user = require("./user");

  // TODO: uncomment to recreate db each time
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

user.init().then(() => app.listen(3001));