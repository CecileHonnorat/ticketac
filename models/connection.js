var mongoose = require('mongoose');
var options = {
     connectTimeoutMS: 5000,
     useNewUrlParser: true,
     useUnifiedTopology : true
       }
       
console.log(process.env.API_KEY)
mongoose.connect(process.env.API_KEY,
       options,
       function(err) {
        if (err) {
          console.log(`error, failed to connect to the database because --> ${err}`);
        } else {
          console.info('*** Database Ticketac connection : Success ***');
        }
       }
    );