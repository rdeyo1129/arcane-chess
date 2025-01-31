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
router.post('/register', async (req, res) => {
  const { loginRegisterErrors, isValid } = validateRegisterInput(req.body);

  if (!isValid) {
    return res.status(400).json(loginRegisterErrors);
  }

  try {
    const existingUser = await User.findOne({
      $or: [{ email: req.body.email }, { username: req.body.username }],
    });

    if (existingUser) {
      let error;
      if (existingUser.email === req.body.email) {
        error = 'Account with that email already exists';
      }
      if (existingUser.username === req.body.username) {
        error = 'Account with that username already exists';
      }
      return res.status(400).json(error);
    }

    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      games: [],
      campaign: {
        topScores: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(newUser.password, salt);
    const savedUser = await newUser.save();

    // Create new Score document
    const newScore = new Score({
      userId: savedUser._id,
      username: savedUser.username,
      scores: new Map(),
    });

    const savedScore = await newScore.save();

    return res.json({ user: savedUser, score: savedScore });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
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
      campaign: {
        topScores: [...Array(12).fill(0)],
      },
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
