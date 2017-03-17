var express = require('express'),
  app = express();
var bodyParser = require("body-parser");

// Configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test', function (err) {
  if (err) throw err;
  else console.log("connected to mongodb");
});

var port = 8080;

var io = require('socket.io').listen(app.listen(port));

require('./config')(app, io);
require('./routes')(app, io);

console.log("Your app is running on 'http://localhost:'" + port);
