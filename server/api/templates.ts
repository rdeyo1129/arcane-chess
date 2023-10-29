import express from 'express';
const router = express.Router();

// Load User model
import { Template } from '../models/Template.js';

router.post('/create', (req) => {
  const newTemplate = new Template({
    ...req.body,
  });
  newTemplate.save();
});

router.get('/search', (req, res) => {
  const keyword = req.query.keyword;
  const regex = new RegExp(keyword as string, 'i');
  Template.find({ name: regex })
    .exec()
    // .then((templates: TemplateI[]) => {
    .then((templates) => {
      return res.status(200).json({ templates });
    })
    .catch((error) => {
      // Handle any errors
      console.error(error);
    });
});

export default router;
