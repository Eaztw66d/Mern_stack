const jwt = require('jsonwebtoken')
const config = require("config");

module.exports = function(req,res,next) {
  // Todo: Get the token from the header
  const token = req.header('x-auth-token');

  // Todo: If there is no token, ....
  if (!token) {
    res.status(401).json({ msg: 'No token, authorization denied!' });
  }

  // Todo: Verify token -- if there is one
  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'));
    req.user = decoded.user;
    next();
  } catch(err) {
    res.status(401).json({ msg: "Invalid Token!" })
  }
}