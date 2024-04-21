import express from 'express';

const router = express.Router();

import { User } from '../models/User.js';
import { Score } from '../models/Score.js';

router.post('/chapter', async (req) => {
  try {
    await User.findOneAndUpdate(
      { _id: req.body.userId },
      {
        $set: {
          [`campaign.chapter`]: req.body.chapter,
        },
      }
    );
  } catch (error) {
    console.log('campaign error', error);
  }
});

router.post('/topScores', async (req, res) => {
  const chapterIndex = req.body.chapterNumber - 1;
  const updatePath = `campaign.topScores.${chapterIndex}`;
  try {
    await Score.findOneAndUpdate(
      {
        userId: req.body.userId,
      },
      {
        $set: {
          [`scores.${String(req.body.chapterNumber)}`]: req.body.chapterPoints,
        },
      },
      { new: true, upsert: true }
    )
      .then(() => {
        User.findOneAndUpdate(
          { _id: req.body.userId },
          {
            $set: {
              [updatePath]: req.body.chapterPoints,
            },
          }
        ).then((user) => {
          return res.json(user?.campaign);
        });
      })
      .catch((err) => console.log(err));
  } catch (error) {
    console.log('campaign top scores error', error);
  }
});

router.post('/newScore', async (req, res) => {
  try {
    new Score({
      userId: req.body.userId,
      username: req.body.username,
      chapter: req.body.chapter,
      score: req.body.score,
    })
      .save()
      .then((user) => res.json(user))
      .catch((err) => console.log(err));
  } catch (error) {
    console.log('campaign scores error', error);
  }
});

router.get('/scores', async (req, res) => {
  const chapterNumber = req.query.chapter;
  try {
    const scores = await Score.aggregate([
      { $match: {} },
      {
        $addFields: {
          score: { $toInt: `$scores.${chapterNumber}` },
        },
      },
      { $sort: { score: -1 } },
      { $limit: 20 },
      {
        $project: {
          _id: 0,
          userId: 1,
          username: 1,
          score: 1,
          chapter: chapterNumber,
        },
      },
    ]);
    res.json(scores);
  } catch (error) {
    console.error('Error fetching scores:', error);
    res.status(500).json({ error: 'Error fetching scores' });
  }
});

export default router;
