const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Story = mongoose.model('stories');
const {ensureAuthenticated, ensureGuest} = require('../helpers/auth');
//welcome page
router.get('/', ensureGuest, (req, res) => {
  res.render('index/welcome');
});

//dashboard page after ensure authenticated
router.get('/dashboard', ensureAuthenticated, (req, res) => {
  Story.find({user:req.user.id})
  .then(stories => {
    res.render('index/dashboard', {
      stories: stories
    });
  });
});

//about page
router.get('/about', (req, res) => {
  res.render('index/about');
});

module.exports = router;
