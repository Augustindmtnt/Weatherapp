var mongoose = require('./bdd');

var citySchema = mongoose.Schema({
      ville: String,
      id: Number,
      temps : String,
      picto : String,
      temp_max : Number,
      temp_min : Number,
})

var cityModel = mongoose.model('cities', citySchema);

module.exports = cityModel;