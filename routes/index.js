var express = require('express');
var router = express.Router();
var request = require('sync-request');
var cityModel = require("../models/cities");

/* météo data */

var errMsg = null;

/* GET home page. */
router.get('/weather', async function(req, res, next) {
  var cityList = await cityModel.find();
  console.log(cityList)
  res.render('index', { cityList, errMsg });
});

/* GET login page. */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Express' });
});

/* Add city */
router.post('/add-city', async function(req, res, next) {


  /* Appel de l'API pour receuillir les informations météo de la ville saisie */
  try {

  var errMsg = null;

  var resp = request("GET", `https://api.openweathermap.org/data/2.5/weather?q=${req.body.city}&units=metric&lang=fr&APPID=a512ea6e86a6184fab6c416f00248b27`);

  var respJSON = JSON.parse(resp.getBody());

  /* Push des informations météo de la ville dans la DB (si la ville n'a pas déjà été entrée et si la requête n'est pas vide) */

  var cityList = await cityModel.find();

  var findCity = cityList.findIndex(element => element.ville.toLowerCase() === req.body.city.toLowerCase());
  
  console.log("index de la ville:", findCity);

  
  if(findCity === -1 && req.body.city !== "") { 
    var newCity = new cityModel(
    {
      ville: respJSON.name,
      id: respJSON.id,
      temps : respJSON.weather[0].description,
      picto : `http://openweathermap.org/img/wn/${respJSON.weather[0].icon}@2x.png`,
      temp_max : respJSON.main.temp_max,
      temp_min : respJSON.main.temp_min,
      delete : "/images/delete.png"
    });
    var createCity = await newCity.save();

    console.log(createCity);
    }

  } catch (err) {
    console.log(err);
    if(err.statusCode = "404") {
      errMsg = "Oups ! le nom de la ville que vous avez saisi n'existe pas. Essayez à nouveau :)";
    }
  }

  var cityList = await cityModel.find();

  res.render('index', { cityList, errMsg });
});

/* Delete city */

router.get('/delete-city', async function(req, res, next) {

  var errMsg = null;

  console.log(req.query);

  await cityModel.deleteOne(
    {ville: req.query.name}
  );

  var cityList = await cityModel.find();

  res.render('index', { cityList, errMsg });

});

module.exports = router;

/* Update weather info */

router.get('/update', async function (req, res, next) {

  var cityList = await cityModel.find();

  var ids=[];

  for(i=0;i<cityList.length; i++) {
    ids.push(cityList[i].id);
  }


  console.log(ids);

  var resp = request("GET", `https://api.openweathermap.org/data/2.5/group?id=${ids},&units=metric&lang=fr&APPID=a512ea6e86a6184fab6c416f00248b27`);

  var respJSON = JSON.parse(resp.getBody());

  console.log(respJSON);


  for(i=0;i<cityList.length;i++) {
    await cityModel.updateOne(
      {id: cityList[i].id},
      {temps : respJSON.list[i].weather[0].description,
      picto : `http://openweathermap.org/img/wn/${respJSON.list[i].weather[0].icon}@2x.png`,
      temp_max : respJSON.list[i].main.temp_max,
      temp_min : respJSON.list[i].main.temp_min}
      
      )
  }

  var cityList = await cityModel.find();


  res.render('index', { cityList, errMsg });


});
