var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  email: {type: String, unique: true},
  password: {type: String},
  firstname = String,
  lastname = String
});

var User = mongoose.model('myuser', userSchema);
module.exports = User;
