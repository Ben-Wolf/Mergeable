var gravatar = require('gravatar');
var id;
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
      // return res.status(200).send();
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
}
