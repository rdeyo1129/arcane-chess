import express from "express";
const router = express.Router();

// // Load Game model
import { Game } from "../models/Game";

// @route POST api/games
// @desc Save games
// @access Public
router.get("/", (req, res) => {
  Game.findOne({ gameId: req.query.gameId })
    .then((game) => {
      console.log("game", game);
      res.json(game);
    })
    .catch((err) => console.log(err));
});

export default router;
