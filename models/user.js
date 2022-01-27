var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    email: String,
    lastName: String,
    firstName: String,
    password: String,
    journeys : [{ type: mongoose.Schema.Types.ObjectId, ref: 'journey' }]
  });
  
  var userModel = mongoose.model('uers', userSchema);
  
  module.exports = userModel;