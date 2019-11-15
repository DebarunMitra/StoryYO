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

let promise;

/**
 * [default route description]
 * @path '/', default route description
 * @method  GET
 * @res stories/index
 */
router.get('/', (req, res) => {
  Story.find({
    status: 'public'
  }).populate('user').sort({
    date: 'desc'
  }).then(stories => {
    res.render('stories/index', {
      stories: stories
    });
  });
});


/**
 * [Show Single Story]
 * @path '/show/:id'
 * @params story id
 * @method  GET
 * @res 'stories/show'
 */
router.get('/show/:id', (req, res) => {
  Story.findOne({
      _id: req.params.id
    })
    .populate('user')
    .populate('comments.commentUser')
    .then(story => {
      if (story.status == 'public') {
        res.render('stories/show', {
          story: story
        });
      } else {
        if (req.user) {
          if (req.user.id == story.user._id) {
            res.render('stories/show', {
              story: story
            });
          } else {
            res.redirect('/stories');
          }
        } else {
          res.redirect('/stories');
        }
      }
    });
});

/**
 * [List stories from a user]
 * @path '/user/:userId'
 * @params user id
 * @method  GET
 * @res stories/index
 */
router.get('/user/:userId', (req, res) => {
  Story.find({
      user: req.params.userId,
      status: 'public'
    })
    .populate('user')
    .then(stories => {
      res.render('stories/index', {
        stories: stories
      });
    });
});

/**
 * [Logged in users stories]
 * @path '/my', user own story
 * @method  GET
 * @res stories/index
 */
router.get('/my', ensureAuthenticated, (req, res) => {
  Story.find({
      user: req.user.id
    })
    .populate('user')
    .then(stories => {
      res.render('stories/index', {
        stories: stories
      });
    });
});


/**
 * [Add Story Form]
 * @path '/add', add story
 * @method  GET
 * @res stories/add
 */
router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('stories/add');
});

/**
 * [rank of selected article]
 * @path '/rank/:id'
 * @params story id
 * @method  GET
 * @res 'stories/rank'
 */
router.get('/rank/:id', (req, res) => {
  let sId = req.params.id;
  Story.findOne({
    _id: req.params.id
  }).populate('user').then((story) => {
    let analysis = new Article(sId, story.body, story.title, story.topic);
    let wordSen = analysis.wordSentences();
    let newWord = analysis.newWord();
    let graSpell = analysis.grammerAndSpellCheck();
    promise = graSpell;
    res.render('stories/rank', {
      story: story,
      graSpell: graSpell,
      wordSen: wordSen,
      words: JSON.stringify(newWord)
    });
  });
});

/**
 * [show grammar and spelling mistakes of selected article]
 * @path '/graspell'
 * @method  GET
 * @res grammar and spelling mistakes
 */
router.get('/graspell', (req, res) => {
  let dataArr = [];
  console.log(promise);
  promise.then(value => {
    console.log(value);
    res.send(value);
  });
});


/**
 * [save article points]
 * @path '/point/:id/:point'
 * @params story id
 * @params story point
 * @method  PUT
 * @res '/dashboard'
 */
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


/**
 * [edit stories]
 * @path '/edit/:id'
 * @params story id
 * @method  GET
 * @res 'stories/edit'
 */
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Story.findOne({
    _id: req.params.id
  }).then((story) => {
    if (story.user != req.user.id) {
      res.redirect('/stories');
    } else {
      res.render('stories/edit', {
        story: story
      });
    }
  });
});


/**
 * [process add Story]
 * @path '/', post default path to save story
 * @method  POST
 * @res ''/stories/show/storyId'
 */
router.post('/', (req, res) => {
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
  //save story object into the db
  new Story(newStory).save().then((story) => {
    res.redirect(`/stories/show/${story.id}`);
  }).catch((err) => console.log('Story Error:' + err));
});

/**
 * [edit form process]
 * @path '/:id'
 * @params story id
 * @method  PUT
 * @res '/dashboard'
 */
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

/**
 * [delete story from db]
 * @path '/:id'
 * @params story id
 * @method  DELETE
 * @res '/dashboard'
 */
router.delete('/:id', (req, res) => {
  Story.remove({
    _id: req.params.id
  }).then(() => {
    res.redirect('/dashboard');
  });
});

/**
 * [Add Comment]
 * @path '/comment/:id'
 * @params story id
 * @method  POST
 * @res '/stories/show/storyId'
 */
router.post('/comment/:id', (req, res) => {
  Story.findOne({
      _id: req.params.id
    })
    .then(story => {
      const newComment = {
        commentBody: req.body.commentBody,
        commentUser: req.user.id
      }

      // Add to comments array
      story.comments.unshift(newComment);

      story.save()
        .then(story => {
          res.redirect(`/stories/show/${story.id}`);
        });
    });
});

module.exports = router;
