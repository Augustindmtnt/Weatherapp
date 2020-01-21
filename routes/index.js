var express = require('express');
var router = express.Router();
var request = require('sync-request');

/* météo data */

var cityList = [];
var errMsg = null;

/* GET home page. */
router.get('/weather', function(req, res, next) {
  res.render('index', { cityList, errMsg });
});

/* GET login page. */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Express' });
});

/* Add city */
router.post('/add-city', function(req, res, next) {


  /* Appel de l'API pour receuillir les informations météo de la ville saisie */
  try {

  var errMsg = null;

  var resp = request("GET", `https://api.openweathermap.org/data/2.5/weather?q=${req.body.city}&units=metric&lang=fr&APPID=a512ea6e86a6184fab6c416f00248b27`);

  var respJSON = JSON.parse(resp.getBody());

  /* Push des informations météo de la ville dans le tableau (si la ville n'a pas déjà été entrée et si la requête n'est pas vide) */

  var findCity = cityList.findIndex(element => element.ville.toLowerCase() === req.body.city.toLowerCase());
  
  console.log("index de la ville:", findCity);

  
  if(findCity === -1 && req.body.city !== "") { 
    cityList.push(
    {
      ville: respJSON.name,
      temps : respJSON.weather[0].description,
      picto : `http://openweathermap.org/img/wn/${respJSON.weather[0].icon}@2x.png`,
      temp_max : respJSON.main.temp_max,
      temp_min : respJSON.main.temp_min,
      delete : "/images/delete.png"
    }
  )
  }

  } catch (err) {
    console.log(err);
    if(err.statusCode = "404") {
      errMsg = "Oups ! le nom de la ville que vous avez saisi n'existe pas. Essayez à nouveau :)";
    }
  }

  res.render('index', { cityList, errMsg });
});

/* Delete city */

router.get('/delete-city', function(req, res, next) {

  console.log(req.query)

  cityList.splice(req.query.position, 1)

  res.render('index', { cityList });

});

module.exports = router;
