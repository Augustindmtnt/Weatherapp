var mongoose = require('mongoose');

var options = {
    connectTimeoutMS: 5000,
    useNewUrlParser: true,
   
        useUnifiedTopology : true
   }
   mongoose.connect('mongodb+srv://augustindmtnt:s^Ae.K+Y3xfgKp8@cluster-capsule-hdlg6.mongodb.net/weatherapp?retryWrites=true&w=majority',
    options,    
    function(err) {
     console.log(err);
    }
   );

   module.exports = mongoose;