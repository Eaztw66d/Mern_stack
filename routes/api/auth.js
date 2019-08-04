const express = require('express');
const router = express.Router();
const auth = require("../../middleware/auth");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator/check");

const User = require('../../models/User');

//* @route    GET api/auth
//* @desc     Test route
//* @access   Public
router.get('/', auth, async (req,res) =>  {
  try {
    const user = await User.findById(req.user.id).select('-password'); //? this will not return the password
    res.json(user);
  } catch(err) {
    console.err(err.message);
    res.status(500).send('Server Error!');
  }
  
});

//* @route    POST api/auth
//* @desc     Authenticate user & token
//* @access   Public
router.post(
  "/",
  [
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Password is required"
    ).exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      //? if error array is not empty then...
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    // todo A: see if user exists
    try {
      let user = await User.findOne({ email }); //? find user by email

      if (!user) {
        //? if user does not exists
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

        // todo: check if plain text pw matches the crypted pw
      const isMatch = await bcrypt.compare(password, user.password);

      if(!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }


      // todo B: Return jsonwebtoken
      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload, 
        config.get("jwtSecret"), 
        { expiresIn: 3600000 },  //? optional but recommended 
        (err, token) => {
        if (err) throw err;
        res.json({ token });
      });
      
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);



module.exports = router;