var gravatar = require('gravatar');
var id;

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
  // app.get('/new', function(req, res) { HOW TO ADD UNIQUE ID's... BREAKS CODE FOR SOME REASON
  //
  //   // Generate unique id for file
  //   var id = Math.round(Math.random() * 1000000);
  //
  //   // Move to text-editor w/ unique filename
  //   res.redirect('/text-editor/' + id);
  // });

  app.get('/new', function(req, res){

    // Move to text-editor
    res.redirect('/text-editor');
  });

  app.get('/text-editor', function(req, res) {

    // Render text-editor.html
    res.render('text-editor');
  });
}
