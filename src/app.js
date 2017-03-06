var express = require('express'),
  app = express();

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test', function (err) {
  if (err) throw err;
  console.log("connected to mongodb");
});

var port = 8080;

var io = require('socket.io').listen(app.listen(port));

require('./config')(app, io);
require('./routes')(app, io);

console.log("Your app is running on 'http://localhost:'" + port);
