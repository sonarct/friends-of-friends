const userService = require('./user.service');


const search = async (req, res) => {
  const query = req.params.query;
  const userId = parseInt(req.params.userId);

  userService.search(userId, query).then(results => {
    console.log('results', results)
    res.json({
      success: true,
      users: []
    })
  }).catch((err) => {
    res.statusCode = 500;
    res.json({ success: false, error: err });
  });
}


const friend = async (req, res) => {
  // TODO: Avoid sql injection
  const { userId, friendId } = req.params

  userService.friend(userId, friendId).then(() => {
    res.json({
      success: true,
    //  TODO: should return here something?
    })
  }).catch((err) => {
    res.statusCode = 500;
    res.json({ success: false, error: err });
  })
}


const unfriend = async (req, res) => {
  // TODO: Avoid sql injection
  const { userId, friendId } = req.params

  userService.unfriend(userId, friendId).then(() => {
    res.json({
      success: true,
      //  TODO: should return here something?
    })
  }).catch((err) => {
    res.statusCode = 500;
    res.json({ success: false, error: err });
  })
}


module.exports.search = search;
module.exports.friend = friend;
module.exports.unfriend = unfriend;
