var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  email: String,
  password: String,
  firstname: String,
  lastname: String
});

var User = mongoose.model('myuser', userSchema);
module.exports = User;
