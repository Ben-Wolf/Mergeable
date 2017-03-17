var ids = [];
var email;
var gravatar = require('gravatar');

var User = require('./models/user.js')
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

module.exports = function(app, io) {

/* MAIN PAGE */
  app.get('/', function(req, res) {

    // Render index.html
    res.render('index');
  });

  app.get('/signout', function(req, res) {

    // Render index.html
    res.render('index');
  });

  // Send login form
  app.post('/login', function(req, res) {
    var email = req.body.email;
    var password = req.body.pass;

    User.findOne({email: email, password: password}, function(err, user) {
      if (err) {
        console.log(err);
        return res.status(500).send();
      }

      if (!user) {
        console.log('user does not exist');
        return res.status(404).send();
      }
      console.log('user found');
      res.redirect('/profile');
      return res.status(200).send();
    })
  });

  // Send registration form
  app.post('/create', function(req,res) {
    var firstname = req.body.f_name;
    var lastname = req.body.l_name;
    var email = req.body.e_mail;
    var password = req.body.pwd;

    var newuser = new User();
    newuser.email = email;
    newuser.password = password;
    newuser.firstname = firstname;
    newuser.lastname = lastname;
    newuser.save(function(err, savedUser) {
      if (err) {
        console.log(err);
        return res.status(500).send();
      }
      else {
        console.log('user created');
        res.redirect('/')
        return res.status(200).send();
      }
    })
  });

/* USER-PROFILE PAGE */
  app.get('/profile', function(req, res) {

    // Move to user_profile
    res.redirect('/user_profile');
  });

  app.get('/user_profile', function(req, res) {

    // Render user_profile
    res.render('user_profile');
  });

/* TEXT-EDITOR PAGE */
  app.get('/new', function(req, res){

    var id = Math.round(Math.random() * 1000000);
    // Move to text-editor
    res.redirect('/editor-' + id);
  });

  app.get('/editor-:id', function(req, res) {

    // Render text-editor.html
    res.render('text-editor');
  });


  /////////////////////////////////////////////////////
  //// SOCKET /////////////////////////////////////////
  /////////////////////////////////////////////////////
  var collab = io.on("connection", function(socket) {

    // Save email for gravatar image.
    socket.on('login', function(data) {
      email = gravatar.url(data, {s: '140', r: 'x', d: "mm"});
      // console.log("avatar = " + email);
    });

    socket.on('get_avatar', function(data) {
      // console.log("after = " + email);
      socket.emit('send_avatar', email);
    });

    // Logs to console that user is in certain ID
    socket.on("checkID", function(data) {
      socket.pioneer = true;
      for (var i = 0; i < ids.length; i++) {
        if (ids[i] === data)
          socket.pioneer = false;
      }
      socket.id = data;
      ids.push(data);
      if (socket.pioneer) {
        console.log("User logged in to ID: " + socket.id + ", as pioneer.");
      }
      else {
        console.log("User joined file: " + socket.id);
        io.emit("find_pioneer", data);
      }
    });

    socket.on('return_info', function(data) {
      if (socket.pioneer == true) {
        io.emit('update', [socket.id, data]);
      }
    });

    socket.on("change", function(data) {
      // console.log(data);
      io.emit("changed", data);
    });

    // Socket function to change language.
    socket.on("changeLanguage", function(data) {
      io.emit("changeLanguage_", data);
    });

    // Socket function to disconnect.
    socket.on("disconnect", function(data) {
      for (var i = 0; i < ids.length; i++) {
        if (ids[i] == socket.id) {
          if (socket.pioneer == true) {
            console.log("Pioneer has left " + socket.id + "... finding next pioneer");
            ids.splice(i, 1);
            break;
            // ADD CODE TO FIND NEXT PIONEER
          }

          else {
            console.log("User has left " + socket.id);
            ids.splice(i, 1);
            break;
          }
        }
      }
    });
  });
};
