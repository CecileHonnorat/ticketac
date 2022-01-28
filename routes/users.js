var express = require('express');
var router = express.Router();
var request = require('sync-request');

var userModel = require('../models/user')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//Route SIGN-IN
router.post('/sign-in', async function(req,res,next){

  var searchUser = await userModel.findOne({
    email: req.body.email,
    password: req.body.password,
  })

  if(searchUser!= null){
    req.session.user = {
      name: searchUser.username,
      id: searchUser._id
    }
    res.redirect('/recherche')
  } else {
    res.render('index')
  }
});

//Route SIGN-UP
router.post('/sign-up', async function(req,res,next){

  var userExist = await userModel.findOne({email: req.body.email});

  if (userExist == null){
  var newUser = new userModel({
    lastName: req.body.lastName,
    firstName: req.body.firstName,
    email: req.body.email,
    password: req.body.password,
      })
  var newUserSave = await newUser.save();
    req.session.user = {
      email: newUserSave.email,
      id: newUserSave._id
    }
       res.redirect('/recherche') 
    } else if (req.body.email == "" || req.body.password == "") {
      res.redirect('/')
    }else {
      console.log("email déjà utilisé");
    res.redirect('/')}
       });


module.exports = router
