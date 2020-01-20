var express = require('express');
var router = express.Router();

/* météo data */

var cityList = []

/* GET home page. */
router.get('/weather', function(req, res, next) {
  res.render('index', { cityList });
});

/* GET login page. */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Express' });
});

/* Add city */
router.post('/add-city', function(req, res, next) {

  var findCity = cityList.findIndex(element => element.ville.toLowerCase() === req.body.city.toLowerCase());
  
  console.log("index de la ville:", findCity);

  
  if(findCity === -1 && req.body.city !== "") { 
    cityList.push(
    {
      ville: req.body.city,
      temps : "nuageux",
      picto : "/images/picto-1.png",
      temp_max : 10.2,
      temp_min : 7.5,
      delete : "/images/delete.png"
    }
  )
  }

  res.render('index', { cityList });
});

/* Delete city */

router.get('/delete-city', function(req, res, next) {

  console.log(req.query)

  cityList.splice(req.query.position, 1)

  res.render('index', { cityList });

});

module.exports = router;
