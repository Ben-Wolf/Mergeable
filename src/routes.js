var ids = [];
var email;
var gravatar = require('gravatar');

var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user.js')

module.exports = function(app, io) {

/* MAIN PAGE */
  app.get('/', function(req, res) {

    // Render index.html
    res.render('index');
  });

  app.get('/signout', function(req, res) {
    req.logout();
    // Render index.html
    res.render('index');
  });

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use(new LocalStrategy({
    usernameField: 'email'
  },
  function(username, password, done) {
    User.getUserByEmail(username, function(err, user){
     	if(err) throw err;
     	if(!user){
        console.log('Unknown user');
     		return done(null, false);
   	}

   	User.comparePassword(password, user.password, function(err, isMatch){
   		if(err) throw err;
   		if(isMatch){
        console.log('User found, Password match');
   			return done(null, user);
   		} else {
        console.log('Invalid password');
   			return done(null, false);
   		}
   	});
   });
  }));

  // Send login form
  app.post('/login',
    passport.authenticate('local', {failureRedirect:'/', failureFlash: 'Invalid username or password.'}),
    function(req, res) {
      console.log("Success");
      res.send({err: 0, redirectUrl: "/profile"});
  });

  // Send registration form
  app.post('/create', function(req,res) {
    var firstname = req.body.f_name;
    var lastname = req.body.l_name;
    var email = req.body.e_mail;
    var password = req.body.pwd;
    var password2 = req.body.pwd2;

    var newUser = new User({
      email: email,
      password: password,
      firstname: firstname,
      lastname: lastname
    });

    // Validation
    req.checkBody('f_name', 'Name is required').notEmpty();
    req.checkBody('l_name', 'Name is required').notEmpty();
    req.checkBody('e_mail', 'Email is required').notEmpty();
    req.checkBody('e_mail', 'Email is not valid').isEmail();
    req.checkBody('pwd', 'Password is required').notEmpty();
    req.checkBody('pwd2', 'Passwords do not match').equals(req.body.pwd);

    var errors = req.validationErrors();

  	if(errors){
  		console.log(errors);
      return res.status(500).send();
		};

    User.getUserByEmail(email, function(err, user) {
      if (err) {
        console.log(err);
        return res.status(500).send();
      }
      if (user) {
        console.log('Email exists in system');
        return res.status(500).send();
      }
      else {
        User.createUser(newUser, function(err, user){
      		if(err) {throw err;
            console.log('error')}
      			console.log(user);
    		});
      }
    });

    res.send({err: 0, redirectUrl: "/"});
    return res.status(200).send();
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
