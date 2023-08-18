import express from "express";
const router = express.Router();
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import keys from "../config/keys";

// Load input validation
import validateRegisterInput from "../validation/register";
import validateLoginInput from "../validation/login";

// Load User model
import { User } from "../models/User";

// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", (req, res) => {
  // Form validation
  const { errors, isValid } = validateRegisterInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        games: [],
        campaign: {
          currentNode: {
            node: { id: "" },
            content: {
              title: "",
              description: "",
              story: "",
              time: [0, 0],
              reward: [0, "", 0],
            },
          },
          completedChapters: [0], // should be static
          completedNodes: [""], // for current chapter selection, clear on new chapter or reset
          topScores: {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
            6: 0,
            7: 0,
            8: 0,
            9: 0,
            10: 0,
            11: 0,
            12: 0,
            13: 0,
          }, // [length - 1] element indexs
          inventory: {
            kudos: 0,
            items: [], // ids #, symbols
            setup: "8/8/8/4K3", // half fen
          },
          config: {
            chapter: null,
            points: null,
            color: "White",
            difficulty: "Novice",
            clock: true,
            blunders: false,
            threats: false,
            checks: false,
            hints: false,
          },
        },
      });

      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then((user) => res.json(user))
            .catch((err) => console.log(err));
        });
      });
    }
  });
});

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const guest = req.body.guest;

  // sign in as guest
  if (guest) {
    // Create JWT Payload
    const payload = {
      id: "0",
      username: req.body.username,
    };

    // Sign token
    jwt.sign(
      payload,
      keys.secretOrKey,
      {
        expiresIn: 31556926, // 1 year in seconds
      },
      (err, token) => {
        res.json({
          campaign: null,
          success: true,
          token: "Bearer " + token,
        });
      }
    );
  } else {
    // Form validation
    const { errors, isValid } = validateLoginInput(req.body);

    // Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    // Find user by email
    User.findOne({ username }).then((user) => {
      // Check if user exists
      if (!user) {
        return res.status(404).json({ usernotfound: "Username not found" });
      }

      // Check password
      bcrypt.compare(password, user.password).then((isMatch) => {
        if (isMatch) {
          // User matched
          // Create JWT Payload
          const payload = {
            id: user.id,
            username: user.username,
          };

          // Sign token
          jwt.sign(
            payload,
            keys.secretOrKey,
            {
              expiresIn: 31556926, // 1 year in seconds
            },
            (err, token) => {
              res.json({
                campaign: user.campaign,
                success: true,
                token: "Bearer " + token,
              });
            }
          );
        } else {
          return res
            .status(400)
            .json({ passwordincorrect: "Password incorrect" });
        }
      });
    });
  }
});

export default router;
