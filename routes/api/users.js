const express = require("express");
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require("express-validator/check");

const User = require("../../models/User");

//* @route    POST api/users
//* @desc     Register user
//* @access   Public
router.post(
  "/",
  [
    check("name", "Name is required")
      .not()
      .isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6})
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {  //? if error array is not empty then...
      return res.status(400).json({ errors: errors.array() })
    }
    const { name, email, password } = req.body;
    // todo A: see if user exists
    try {
      let user = await User.findOne({ email });  //? find user by email

      if (user) {  //? is user is found (already exists), then...
        return res.status(400).json({ errors: [ { msg: 'User already exists '}] });
      }
    // todo B: get users gravatar
    const avatar = gravatar.url(email, {
      s: '200',
      r: 'pg',
      d: 'mm'  //? mm gives a default image if no gravatar account
    })

    user = new User({
      name,
      email,
      avatar, 
      password
    })

    // todo C: Encrypt password
    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(password, salt);

    await user.save();

    // todo D: Return jsonwebtoken
    res.send("User registered");
    } catch(err) {
      console.error(err.message) ;
      res.status(500).send('Server Error');
    }
    
  }
);

module.exports = router;
