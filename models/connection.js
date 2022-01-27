var mongoose = require('mongoose');
var options = {
     connectTimeoutMS: 5000,
     useNewUrlParser: true,
     useUnifiedTopology : true
       }

mongoose.connect('mongodb+srv://cecileH:pA7uJfdrvkxW8k@cluster0.n2ct8.mongodb.net/ticketac?retryWrites=true&w=majority',
       options,
       function(err) {
        if (err) {
          console.log(`error, failed to connect to the database because --> ${err}`);
        } else {
          console.info('*** Database Ticketac connection : Success ***');
        }
       }
    );