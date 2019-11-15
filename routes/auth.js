const express = require('express');
const router = express.Router();
const passport = require('passport');

/**
 * [getting user email and profile details from browser cookies]
 * @path '/google'
 * @res '/dashboard'
 */
router.get('/google', passport.authenticate('google', {scope: ['profile', 'email']}));

/**
 * [getting user email and profile details via google login]
 * @path '/google/callback'
 * @res '/dashboard'
 */
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),(req, res) => {
    res.redirect('/dashboard');
  });

  /**
   * [verify user]
   * @path '/verify'
   * @res redirect to default path
   */
router.get('/verify', (req, res) => {
  if(req.user){
    console.log(req.user);
  } else {
    console.log('not authenticate');
  }
});

/**
 * [logout]
 * @path '/logout'
 * @res redirect to default path
 */
router.get('/logout', (req, res) => {
 req.logout();
 res.redirect('/');
});

module.exports = router;
