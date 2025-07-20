import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import passport from '../config/passport.js';

import validateRegisterInput from '../validation/register.js';
import validateLoginInput from '../validation/login.js';

import { User, UserI } from '../models/User.js';
import { Score } from '../models/Score.js';

dotenv.config();
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// @route   POST /api/users/register
// @desc    Register user
// @access  Public
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
      if (existingUser.email === req.body.email)
        loginRegisterErrors.existingEmail =
          'Account with that email already exists';
      if (existingUser.username === req.body.username)
        loginRegisterErrors.existingUser =
          'Account with that username already exists';
      return res.status(400).json(loginRegisterErrors);
    }

    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      games: [],
      campaign: { topScores: Array(12).fill(0) },
      role: 'user',
      avatar: req.body.avatar || '',
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(newUser.password, salt);
    const savedUser = await newUser.save();

    // Create Score document
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

// @route   POST /api/users/login
// @desc    Login user and return JWT + user
// @access  Public
router.post('/login', async (req, res) => {
  const { username, password, guest } = req.body;

  if (guest) {
    // Guest payload
    const guestUser = {
      id: '0',
      username: username || 'guest',
      role: 'user',
      campaign: { topScores: Array(12).fill(0) },
      avatar: '',
    };
    const token = jwt.sign(guestUser, JWT_SECRET, { expiresIn: '1y' });
    return res.json({
      success: true,
      token: 'Bearer ' + token,
      user: guestUser,
    });
  }

  // Validate input
  const { loginRegisterErrors, isValid } = validateLoginInput(req.body);
  if (!isValid) {
    return res.status(400).json({ errors: loginRegisterErrors });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ usernotfound: 'Username not found' });
    }

    // Backfill missing fields if necessary
    let patched = false;
    if (!user.role) {
      user.role = 'user';
      patched = true;
    }
    if (user.avatar === undefined) {
      user.avatar = '';
      patched = true;
    }
    if (patched) await user.save();

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ passwordincorrect: 'Password incorrect' });
    }

    // Build JWT payload
    const payload = {
      id: user._id,
      username: user.username,
      role: user.role,
      campaign: user.campaign,
      avatar: user.avatar,
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1y' });

    return res.json({
      success: true,
      token: 'Bearer ' + token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        campaign: user.campaign,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/users/me
// @desc    Return current user profile
// @access  Private
router.get(
  '/me',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const user = req.user as UserI;
    if (!user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    return res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      games: user.games,
      campaign: user.campaign,
      avatar: user.avatar,
      createdAt: user.createdAt,
    });
  }
);

export default router;
