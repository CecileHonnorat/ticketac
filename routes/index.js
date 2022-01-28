var express = require('express');
var router = express.Router();
var journeyModel = require('../models/journey');
var userModel = require('../models/user')
const mongoose = require('mongoose');
const { formatArgs } = require('debug/src/browser');
const { findOne, find } = require('../models/journey');
const req = require('express/lib/request');

// useNewUrlParser ;)
var options = {
  connectTimeoutMS: 5000,
  useNewUrlParser: true,
  useUnifiedTopology: true
};

// --------------------- BDD -----------------------------------------------------


var city = ["Paris", "Marseille", "Nantes", "Lyon", "Rennes", "Melun", "Bordeaux", "Lille"]
var date = ["2018-11-20", "2018-11-21", "2018-11-22", "2018-11-23", "2018-11-24"]

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/* GET home page. */
router.get('/', function (req, res, next) {

  res.render('index', { title: 'Express', user :req.session.user });
});


// Remplissage de la base de donnée, une fois suffit
router.get('/save', async function (req, res, next) {

  // How many journeys we want
  var count = 300

  // Save  ---------------------------------------------------
  for (var i = 0; i < count; i++) {

    departureCity = city[Math.floor(Math.random() * Math.floor(city.length))]
    arrivalCity = city[Math.floor(Math.random() * Math.floor(city.length))]

    if (departureCity != arrivalCity) {

      var newUser = new journeyModel({
        departure: departureCity,
        arrival: arrivalCity,
        date: date[Math.floor(Math.random() * Math.floor(date.length))],
        departureTime: Math.floor(Math.random() * Math.floor(23)) + ":00",
        price: Math.floor(Math.random() * Math.floor(125)) + 25,
      });

      await newUser.save();

    }

  }
  res.render('index', { title: 'Express' });
});


// Cette route est juste une verification du Save.
// Vous pouvez choisir de la garder ou la supprimer.
// router.get('/result', function(req, res, next) {

//   // Permet de savoir combien de trajets il y a par ville en base
//   for(i=0; i<city.length; i++){

//     journeyModel.find( 
//       { departure: city[i] } , //filtre

//       function (err, journey) {

//           console.log(`Nombre de trajets au départ de ${journey[0].departure} : `, journey.length);
//       }
//     )

//   }


//   res.render('result', { title: 'Express' });
// });

//Route choix destination
router.post('/recherche', async function (req, res, next) {
  if(req.session.user===undefined){
    res.redirect('/')
  }

   var searchJourney = await journeyModel.find(
    {
      departure: capitalizeFirstLetter(req.body.from.toString().toLowerCase()),
      arrival: capitalizeFirstLetter(req.body.to.toString().toLowerCase()),
      date: capitalizeFirstLetter(req.body.date.toString().toLowerCase())
    });
  var date = req.body.date;
  if (searchJourney == ''){
    res.redirect('nonresult')
  }else { 
    var newJourney = searchJourney;
    res.render('result', { newJourney, date, user : req.session.user })}
  console.log(newJourney);
})

//Route Results
router.get('/result', async function(req, res, next){
  if(req.session.user===undefined){
    res.redirect('/')
  }
  var user = req.session.user
  var basket = basket.session.user
  res.render('result', {user, basket})
})

//Route si pas de résultats
router.get('/nonresult', async function (req, res, next) {
  if(req.session.user===undefined){
    res.redirect('/')
  }
  res.render('nonresult', {user: req.session.user})
})

// Route lasttrip 
router.get('/mylasttrip', async function (req, res, next) {
  if(req.session.user===undefined){
    res.redirect('/')
  }

  var trips = await userModel.findById(req.session.user.id).populate('journeys').exec();
  res.render('mylasttrip', { trips, user : req.session.user })
})

router.get('/trajet', async function (req, res, next) {
  if(req.session.user===undefined){
    res.redirect('/')
  }
  if (req.session.basket == undefined) {
    req.session.basket = []
  }
  const journeyToFind = req.session.basket.find(e => e._id == req.query._id);
  var trajet = await journeyModel.findById({
    _id: req.query.id
  })
  if(!journeyToFind){
    req.session.basket.push(trajet)
  
  res.render('trajet', { trajet, basket: req.session.basket, user:req.session.user })
} else {res.redirect('recherche')}
})

// Valider panier
router.get('/validation-basket', async function(req, res, next){
  if(req.session.user===undefined){
    res.redirect('/')
  }
  var user = await userModel.findById(req.session.user.id)
  for(var i = 0; i < req.session.basket.length; i++){
    user.journeys.push(req.session.basket[i]._id)
  }
  await user.save()
  req.session.basket = []
  res.render('recherche', {user: req.session.user, basket: req.session.basket})
})

router.get('/recherche', async function (req, res, next) {
  if(req.session.user===undefined){
    res.redirect('/')
  }
  console.log(req.session.user);
  res.render('recherche', {user:req.session.user})
})

//Route création POPUP
router.get('/confirm', async function(req, res, next){
  res.render('index')
})

//Route suppression Ticket
router.get('/delete', async function(req, res, next){
  if(req.session.user===undefined){
    res.redirect('/')
  }
  req.session.basket.splice(req.query.position,1)
  console.log();
/*   var trajet = await userModel.findById("61f3f26945869ef2e6680820").populate('basket').exec()
  var deleteRoute = trajet.basket.splice(req.query.position, 1);
  await trajet.save()
  var newBasket = await userModel.findById("61f3f26945869ef2e6680820").populate('basket').exec() */
  res.render('trajet', {basket: req.session.basket, user: req.session.user})
})

module.exports = router;
