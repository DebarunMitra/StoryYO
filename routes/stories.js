const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('users');
const Story = mongoose.model('stories');
const {
  ensureAuthenticated,
  ensureGuest
} = require('../helpers/auth');
const Article = require('../analyser/analysis');

// Stories Index
router.get('/', (req, res) => {
  //  res.render('stories/index');
  Story.find({
    status: 'public'
  }).populate('user').then(stories => {
    res.render('stories/index', {
      stories: stories
    });
  });
});

//show silgle Story
router.get('/show/:id', (req, res) => {
  Story.findOne({
    _id: req.params.id
  }).populate('user').then((story) => {
    res.render('stories/show', {
      story: story
    });
  });
});

// Add Story Form
router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('stories/add');
});

// point your article
router.get('/rank/:id', (req, res) => {
  let sId = req.params.id;
  Story.findOne({
    _id: req.params.id
  }).populate('user').then((story) => {
    let analysis = new Article(sId, story.body, story.title, story.topic);
    let wordSen = analysis.wordSentences();
    let newWord = analysis.newWord();
    //let getErr=analysis.getMistakes();
    let graSpell = analysis.grammerAndSpellCheck();
    //graSpell.then((value) => {console.log(value);});
    //  console.log(graSpell);
    res.render('stories/rank', {
      story: story,
      //graSpell:graSpell,
      wordSen: wordSen,
      words: JSON.stringify(newWord)
    });
  });
});

//save article points
router.put('/point/:id/:point', (req, res) => {
  Story.findOne({
    _id: req.params.id
  }).then((story) => {
    //new values
    story.point = req.params.point;
    story.save().then(story => {
      res.redirect('/dashboard');
    });
  });
});


//edit stories
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Story.findOne({
    _id: req.params.id
  }).then((story) => {
    res.render('stories/edit', {
      story: story
    })
  });
});


//process add Story
router.post('/', (req, res) => {
  //console.log(req.body);
  let allowComments;
  if (req.body.allowComments) {
    allowComments = true;
  } else {
    allowComments = false;
  }
  //story object created
  const newStory = {
    title: req.body.title,
    body: req.body.body,
    status: req.body.status,
    topic: req.body.topic,
    allowComments: allowComments,
    user: req.user.id
  };
  //console.log(newStory);
  //save story object into the db
  new Story(newStory).save().then((story) => {
    res.redirect(`/stories/show/${story.id}`);
    //console.log(story.id);
  }).catch((err) => console.log('Story Error:' + err));
});

//edit form process
router.put('/:id', (req, res) => {
  Story.findOne({
    _id: req.params.id
  }).then((story) => {
    if (req.body.allowComments) {
      allowComments = true;
    } else {
      allowComments = false;
    }
    //new values
    story.title = req.body.title;
    story.topic = req.body.topic;
    story.status = req.body.status;
    story.allowComments = allowComments;
    story.body = req.body.body;
    
    story.save().then(story => {
      res.redirect('/dashboard');
    });
  });
});

//delete story from db
router.delete('/:id', (req, res) => {
  Story.remove({
    _id: req.params.id
  }).then(() => {
    res.redirect('/dashboard');
  });
});

module.exports = router;
