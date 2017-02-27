var gravatar = require('gravatar')

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
  app.get('/login', function(req, res) {

    // Move to user_profile
    res.redirect('/user_profile');
  });

  app.get('/user_profile', function(req, res) {

    // Render user_profile
    res.render('user_profile');
  });

/* TEXT-EDITOR PAGE */
  app.get('/new', function(req, res) {

    // Generate unique id for file
    var id = Math.round(Math.random() * 1000000);

    // Move to text-editor w/ unique filename
    res.redirect('/text-editor/' + id);
  });

  app.get('/text-editor/:id', function(req, res) {

    // Render text-editor.html
    res.render('text-editor');
  });
}
