import express from 'express';
const router = express.Router();
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
// import { keys } from '../config/keys.js';

// Load input validation
import validateRegisterInput from '../validation/register.js';
import validateLoginInput from '../validation/login.js';

// Load User model
import { User } from '../models/User.js';
import { Score } from '../models/Score.js';

// @route POST api/users/register
// @desc Register user
// @access Public
router.post('/register', (req, res) => {
  // Form validation
  const { loginRegisterErrors, isValid } = validateRegisterInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(loginRegisterErrors);
  }

  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      return res
        .status(400)
        .json({ email: 'Account with that email already exists' });
    } else {
      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        games: [],
        campaign: {
          // chapter: 0,
          topScores: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          // config: {
          //   points: null,
          //   color: 'White',
          //   difficulty: 'Novice',
          //   depth: 2,
          //   thinkingTime: 4,
          //   clock: true,
          //   blunders: false,
          //   threats: false,
          //   checks: false,
          //   hints: false,
          // },
        },
      });

      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        if (err) console.log('get salt err', err);
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then((user) => res.json(user))
            .catch((err) => console.log(err));
        });
      });

      // new user score db instance
      new Score({
        userId: newUser._id,
        username: newUser.username,
        scores: new Map(),
      })
        .save()
        .then((score) => res.json(score))
        .catch((err) => console.log(err));
    }
  });
});

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const guest = req.body.guest;

  // sign in as guest
  if (guest) {
    // Create JWT Payload
    const payload = {
      id: '0',
      username: req.body.username,
    };

    // Sign token
    jwt.sign(
      payload,
      'secret',
      {
        expiresIn: 31556926, // 1 year in seconds
      },
      (err, token) => {
        if (err) console.log('jwt err', err);
        res.json({
          id: '0',
          campaign: {
            topScores: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          },
          success: true,
          token: 'Bearer ' + token,
        });
      }
    );
  } else {
    // Form validation
    const { loginRegisterErrors, isValid } = validateLoginInput(req.body);

    // Check validation
    if (!isValid) {
      return res.status(400).json(loginRegisterErrors);
    }

    // Find user by email
    User.findOne({ username }).then((user) => {
      // Check if user exists
      if (!user) {
        return res.status(404).json({ usernotfound: 'Username not found' });
      }

      // Check password
      bcrypt.compare(password, user.password).then((isMatch) => {
        if (isMatch) {
          // User matched
          // Create JWT Payload
          const payload = {
            id: user._id,
            username: user.username,
            campaign: user.campaign,
          };

          // Sign token
          jwt.sign(
            payload,
            'secret',
            {
              expiresIn: 31556926, // 1 year in seconds
            },
            (err, token) => {
              if (err) {
                console.log('jwt err', err);
              }
              res.json({
                id: user.id,
                campaign: user.campaign,
                success: true,
                token: 'Bearer ' + token,
              });
            }
          );
        } else {
          return res
            .status(400)
            .json({ passwordincorrect: 'Password incorrect' });
        }
      });
    });
  }
});

export default router;
