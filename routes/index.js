var express = require('express');
var router = express.Router();
var models = require('../models');
// could use one line instead: var router = require('express').Router();
//var tweetBank = require('../tweetBank');

router.get('/', function (req, res) {
  //var tweets = tweetBank.list();
  //res.render( 'index', { title: 'Twitter.js', tweets: tweets } );
  //TODO: get all the tweets without tweetBank
  models.User.findAll({
    order: ['name'],
    include: [models.Tweet]
  }).then(function(users){
    //console.dir(users);
    res.render('index', {
      //title: 'Twitter.sql',
      users: users
    });
  });

});


router.get('/users/:userName', function(req,res){
  var name = req.params.userName;
  models.User
  .findOne({where: {name: name},
            include: [models.Tweet],
            order: ["id"]})
  .then(function(user){
    res.render('index', {
      users: [user]
    });
  });
});


router.get('/users/:userName/tweets/:id', function(req,res){
  var name = req.params.userName;
  var id = req.params.id;
  models.User
  .findOne({where: {name: name},
            include: [{model: models.Tweet,
            where: {id: id}}]
  }).then(function(user) {
    console.log(JSON.stringify(user));
    res.render('index', {users: [user]});
  });
});


router.get('/tweets/:id', function(req,res){
  var id = req.params.id;
  models.Tweet
  .findOne({where: {id: id},
            include: [models.User]})
  .then(function(tweet){
    console.dir(tweet);
    res.render('tweet', {
      tweet: tweet,
      userName: tweet.dataValues.User.name
    });
  });
});



router.post('/submit', function(req, res) {
    console.log("Hello! at /submit");
    debugger;
  var name = req.body.name;
  var text = req.body.text;
  //tweetBank.add(name, text);

  models.User
  .findOrCreate({where: {name: name}, defaults: {}})
  .then(function(user){
     models.Tweet.create({
         tweet: text,
         UserId: user[0].dataValues.id});
  }).then(function() {
        res.redirect('/');
    });
});





module.exports = router;
