var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    email: String,
    lastName: String,
    firstName: String,
    password: String,
    journeys : [{ type: mongoose.Schema.Types.ObjectId, ref: 'journey' }],
    basket : [{ type: mongoose.Schema.Types.ObjectId, ref: 'journey' }]
  });
  
  var userModel = mongoose.model('users', userSchema);
  
  module.exports = userModel;