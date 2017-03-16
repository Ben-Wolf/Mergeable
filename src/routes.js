var gravatar = require('gravatar');
var ids = [];

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
  app.get('/new', function(req, res){

    var id = Math.round(Math.random() * 1000000);
    // Move to text-editor
    res.redirect('/editor-' + id);
  });

  app.get('/editor-:id', function(req, res) {

    // Render text-editor.html
    res.render('text-editor');
  });

  var collab = io.on("connection", function(socket) {


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
        console.log("pioneer found");
        io.emit('update', [socket.id, data]);
      }
    });

    socket.on("change", function(data) {
      // console.log(data);
      io.emit("changed", data);
    });

    /*
     *  SOCKET LANGUAGE CHANGES
     */
    socket.on("CSHARP", function(data) {
     io.emit("csharp_", data);
    });

    socket.on("CSS", function(data) {
     io.emit("css_", data);
    });

    socket.on("HTML", function(data) {
      io.emit("html_", data);
    });

    socket.on("JAVA", function(data) {
      io.emit("javascript_", data);
    });

    socket.on("JAVASCRIPT", function(data) {
      io.emit("javascript_", data);
    });

    socket.on("PYTHON", function(data) {
      io.emit("python_", data);
    });

    socket.on("TYPESCRIPT", function(data) {
      io.emit("typescript_", data);
    });

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
