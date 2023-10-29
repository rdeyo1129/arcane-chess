import express from 'express';
const router = express.Router();

// // Load Game model
import { Game } from '../models/Game.js';

// @route POST api/games
// @desc Save games
// @access Public
router.get('/', (req, res) => {
  Game.findOne({ gameId: req.query.gameId })
    .then((game: any) => {
      console.log('game', game);
      res.json(game);
    })
    .catch((err: any) => console.log(err));
});

export default router;
