/*
Author: Debarun Mitra
Technlogy: MongoDB, ExpressJS, NodeJS
Objective: Create an application where people can share their stories, ideas, thoughts and experiences.
*/
module.exports = {
  ensureAuthenticated: function(req, res, next){
    if(req.isAuthenticated()){
      return next();
    }
    res.redirect('/');
  },
  ensureGuest: function(req, res, next){
    if(req.isAuthenticated()){
      res.redirect('/dashboard');
    } else {
      return next();
    }
  }
}