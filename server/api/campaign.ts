import express from 'express';

const router = express.Router();

// Load models
import { User } from '../models/User.js';

// @route POST api/campaign
// @desc Save campaign
// @access Public
// router.post('/', async (req, res) => {
//   try {
//     const key1 = req.body.key1;
//     const key2 = req.body.key2;
//     const value = req.body.value;

//     if (key2 === 'reset') {
//       await User.findOneAndUpdate(
//         { _id: req.body.userId },
//         {
//           $set: {
//             [`campaign.${key1}`]: [''],
//           },
//         }
//       ).then((user) => {
//         return res.json(user?.campaign);
//       });
//     } else if (key1 === 'completedChapters' || key1 === 'completedNodes') {
//       // chapter and node arrays
//       if (key2 === 'campReset') {
//         await User.findOneAndUpdate(
//           { _id: req.body.userId },
//           {
//             $set: {
//               [`campaign.${key1}`]: value,
//             },
//           }
//         ).then((user) => {
//           return res.json(user?.campaign);
//         });
//       } else {
//         await User.findOneAndUpdate(
//           { _id: req.body.userId },
//           {
//             $push: {
//               [`campaign.${key1}`]: value,
//             },
//           }
//         ).then((user) => {
//           return res.json(user?.campaign);
//         });
//       }
//     } else if (key1 === 'inventory') {
//       // items array
//       await User.findOneAndUpdate(
//         { _id: req.body.userId },
//         {
//           $set: {
//             ['campaign.inventory']: value,
//           },
//         }
//       ).then((user) => {
//         return res.json(user?.campaign);
//       });
//     } else if (key2) {
//       // used to set chpater specific topscores, inventory, configs
//       await User.findOneAndUpdate(
//         { _id: req.body.userId },
//         {
//           $set: {
//             [`campaign.${key1}.${key2}`]: value,
//           },
//         }
//       ).then((user) => {
//         return res.json(user?.campaign);
//       });
//     } else {
//       await User.findOneAndUpdate(
//         { _id: req.body.userId },
//         {
//           $set: {
//             [`campaign.${key1}`]: value,
//           },
//         }
//       ).then((user) => {
//         return res.json(user?.campaign);
//       });
//     }
//   } catch (error) {
//     console.log('campaign error', error);
//   }
// });

router.post('/chapter', async (req, _res) => {
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
  try {
    const key = req.body.key;
    const value = req.body.value;

    console.log(req.body, key, value);

    await User.findOneAndUpdate(
      { _id: req.body.userId },
      {
        $push: {
          [`campaign.${key}`]: value,
        },
      }
    ).then((user) => {
      return res.json(user?.campaign);
    });
  } catch (error) {
    console.log('campaign error', error);
  }
});

export default router;
