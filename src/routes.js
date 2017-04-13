var ids = [];
var acc;
var userid = "";
var data = {err: 0, redirectUrl: "/"};

var gravatar = require('gravatar');
var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user.js');
var Document = require('./models/document.js');

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
    userid = user.id;
    return done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
      return done(err, user);
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
        acc = user;
   			done(null, user);
   		} else {
        console.log('Invalid password');
   			done(null, null);
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
      lastname: lastname,
      description: "An awesome Mergeable Developer!"
    });

    // Validation
    req.checkBody('f_name', 'First Name is required').notEmpty();
    req.checkBody('l_name', 'Last Name is required').notEmpty();
    req.checkBody('e_mail', 'Email is required').notEmpty();
    req.checkBody('e_mail', 'Email is not valid').isEmail();
    req.checkBody('pwd', 'Password is required').notEmpty();
    req.checkBody('pwd2', 'Passwords do not match').equals(req.body.pwd);

    var errors = req.validationErrors();

  	if(errors){
  		console.log(errors);
      data.err = 1;
      data.errors = errors;
		}

    else {
      User.getUserByEmail(email, function(err, user) {
        if (err) {
          data.err = 2;
        }
        else {
          if (data.err == 0) {
            if (user) {
              data.err = 3;
            }
            if (data.err == 0) {
              User.createUser(newUser, function(err, user){
            		if(err) {throw err;
                  console.log('error')}
          			console.log(user);
          		});
            }
          }
        }
      });
    }

    res.send(data);
    data.err = 0;
    return res.status(200).send();
  });

/* USER-PROFILE PAGE */
  app.post('/get_info', function(req, res) {
    var info = {documents: []};
    info.avatar = gravatar.url(req.user.email, {s: '140', r: 'x', d: 'mm'});
    info.firstname = req.user.firstname;
    info.lastname = req.user.lastname;
    info.description = req.user.description;

    if (req.user.documents.length == 0) {
      res.send(info);
      return res.status(200).send();
    }

    for (var i=0; i<req.user.documents.length; i++) {
      Document.getDocumentById(req.user.documents[i], function(err, doc) {
        if (err) {
          console.log(err);
        } else {
          if (doc) {
            console.log("Document found");
            var data = {};
            data._id = doc._id;
            data.title = doc.title;
            data.dateCreated = doc.dateCreated;
            data.lastModified = doc.lastModified;
            data.file = doc.file;
            data.otherEditors = doc.otherEditors;
            info.documents.push(data);
            if (info.documents.length == req.user.documents.length) {
              res.send(info);
              return res.status(200).send();
            }
          } else {
            console.log("Document not found");
          }
        }
      });
    }
  });

  app.get('/profile', function(req, res) {
    // Move to user_profile
    res.redirect('/user_profile-' + userid);
  });

  app.get('/user_profile-:userid', function(req, res) {

    // Render user_profile
    res.render('user_profile');
  });

  app.post('/save_description', function(req, res) {
    req.user.description = req.body.description;
    req.user.save(function(err) {
      if (err) console.log(err);
      else console.log("Saved description");
    });
  });

  app.post('/remove_document', function(req, res) {
    var id = req.body.id;
    var info = {};
    console.log(id);

    // Remove document from user account
    Document.findById(id, function(err, doc) {
      if (err) {
        console.log(err);
      } else {
        if (doc) {
          // Remove file from owner
          User.getUserByEmail(doc.owner, function(err, user) {
            if (user) {
              var index = user.documents.indexOf(id);
              if (index > -1) {
                user.documents.splice(index, 1);
                user.save(function(err) {
                  if (err) {
                    console.log(err);
                  } else {
                    console.log("Document removed from owner");
                  }
                });
              }
            } else {
              console.log("Owner not found");
            }
          });

          // Remove file from other editors
          for (var i=0; i<doc.otherEditors.length; i++){
            User.getUserByEmail(doc.otherEditors[i], function(err, user) {
              if (user) {
                var index = user.documents.indexOf(id);
                if (index > -1) {
                  user.documents.splice(index, 1);
                  user.save(function(err) {
                    if (err) {
                      console.log(err);
                    } else {
                      console.log("Document removed from editor");
                    }
                  });
                }
              } else {
                console.log("Editor not found");
              }
            });
          }

        } else {
          console.log("Document not found in database");
        }
      }
    });

    // Remove document
    Document.removeDocumentById(id, function(err) {
      if (err) {
        console.log(err);
        info.err = 1;
      } else {
        console.log("Document deleted!");
        info.err = 0;
      }
    });

    res.send(info);
    return res.status(200).send();
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

  app.post('/save_new', function(req, res) {
    var owner = req.user.email;
    var title = req.body.title;
    var date = Date.now();
    var file = req.body.file;
    var otherEditors = req.body.otherEditors;

    if (otherEditors != "") {
      otherEditors = otherEditors.split(",");
      for(var i=0; i<otherEditors.length; i++) {
        otherEditors[i] = otherEditors[i].trim();
      }
    } else {
      otherEditors = [];
    }

    var newDocument = new Document({
      owner: owner,
      title: title,
      dateCreated: date,
      lastModified: date,
      file: file,
      otherEditors: otherEditors
    });

    req.checkBody('title', 'Document name is required').notEmpty();
    var errors = req.validationErrors();

    if(errors){
  		console.log(errors);
      data.err = 1;
      data.errors = errors;
		}else {
      Document.createDocument(newDocument, function(err, doc){
        if(err) {
          console.log('error');
        } else {
          console.log(doc);

          // Add document to user account
          var user = req.user;
          user.documents.push(doc._id);
          user.save(function(err) {
            if (err) {
              console.log(err);
            } else {
              console.log("New document added under owner: " + user.email);
            }
          });

          // Add document to otherEditors' accounts
          for (var i=0; i<otherEditors.length; i++){
            User.getUserByEmail(otherEditors[i], function(err, user) {
              if (err) {
                console.log(err);
              } else {
                if (!user) {
                  console.log("Account does not exist.");
                } else {
                  user.documents.push(doc._id);
                  user.save(function(err) {
                    if (err) {
                      console.log(err);
                    } else {
                      console.log("New document added under: " + user.email);
                    }
                  });
                }
              }
            });
          }
        }
      });
    }

    res.send(data);
    data.err = 0;
    return res.status(200).send();
  });

  /////////////////////////////////////////////////////
  //// SOCKET /////////////////////////////////////////
  /////////////////////////////////////////////////////
  var collab = io.on("connection", function(socket) {

    // Saves profile description.
    socket.on('save_description', function(data) {
      console.log("DATA = " + acc.description);
      acc.description = data;
      console.log("DATA AFTER = " + acc.description);
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
        console.log("CHANGING LANGUAGE TO: " + data.language);
        io.emit('update', [socket.id, data.info, data.language]);
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
