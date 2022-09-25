const userService = require("./user.service");

// app.get(
//   "search",
//   validateQuery, // service
//   validateUserId, // service
//   searchUser // controller
// );

const search = async (req, res) => {
  const { query } = req.params;
  // TODO: validate userId. nestjs -> pipe & validator @isString
  const userId = parseInt(req.params.userId);

  userService
    .search(userId, query)
    .then((results) => {
      res.json({
        success: true,
        users: results,
      });
    })
    .catch((err) => {
      // TODO: write log with errors and log all errors to console
      console.log(err)
      res.statusCode = 500;
      res.json({ success: false, error: err });
    });
};

const friend = async (req, res) => {
  // TODO: Avoid sql injection
  const { userId, friendId } = req.params;

  try {
    await userService.addFriend(userId, friendId);
    res.statusCode = 201
    return res.json({
      success: true,
      //  TODO: should return here something?
    });
  } catch (err) {
    console.error(err)
    res.statusCode = 500;
    res.json({ success: false, error: err });
  }
};

const unfriend = async (req, res) => {
  // TODO: Avoid sql injection
  const { userId, friendId } = req.params;

  userService
    .unfriend(userId, friendId)
    .then(() => {
      res.json({
        success: true,
        //  TODO: should return here something?
      });
    })
    .catch((err) => {
      res.statusCode = 500;
      res.json({ success: false, error: err });
    });
};

module.exports.search = search;
module.exports.friend = friend;
module.exports.unfriend = unfriend;
