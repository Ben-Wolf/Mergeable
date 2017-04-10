var editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");
editor.session.setMode("ace/mode/javascript");
editor.getSession().setValue("Your code here");
editor.$blockScrolling = Infinity;

$(document).ready(function() {
  // Access the socket
  var socket = io();
  var id = getID(window.location.pathname);
  var holder = 0;

  // Will use this to check for permissions in future?
  // Currently sets the first person to work on a file as "pioneer"
  socket.emit("checkID", id);

  // Function that sends changes to the editor to multiple viewers
  editor.getSession().on('change', function(e) {
    data = [id, holder, editor.getSession().getValue()];
    socket.emit('change', data);
  });


  // Arrays to hold all the elements in each drop down list.
  var languages = ["#CSharp", "#CSS", "#HTML", "#Java", "#JavaScript", "#Python", "#TypeScript"];
  var themes = ["#Chrome", "#Clouds", "#Cobalt", "#Eclipse", "#Github", "#Merbivore", "#Mono_industrial", "#Monokai", "#Terminal"];
  var sizes = ["#size10", "#size11", "#size12", "#size13", "#size14", "#size16", "#size20", "#size24"];

  /* Language Options */
  // Emits a socket, because changing the language on a file should affect everyone working on the file.
  $("#CSharp").click(function() {
    socket.emit("changeLanguage", ["#CSharp", id]);
  });
  $("#CSS").click(function() {
    socket.emit("changeLanguage", ["#CSS", id]);
  });
  $("#HTML").click(function() {
    socket.emit("changeLanguage", ["#HTML", id]);
  });
  $("#Java").click(function() {
    socket.emit("changeLanguage", ["#Java", id]);
  });
  $("#JavaScript").click(function() {
    socket.emit("changeLanguage", ["#JavaScript", id]);
  });
  $("#Python").click(function() {
    socket.emit("changeLanguage", ["#Python", id]);
  });
  $("#TypeScript").click(function() {
    socket.emit("changeLanguage", ["#TypeScript", id]);
  });

  /* Theme Options */
  $("#Chrome").click(function() {
    change("#Chrome", "theme", themes);
  });
  $("#Clouds").click(function() {
    change("#Clouds", "theme", themes);
  });
  $("#Cobalt").click(function() {
    change("#Cobalt", "theme", themes);
  });
  $("#Eclipse").click(function() {
    change("#Eclipse", "theme", themes);
  });
  $("#Github").click(function() {
    change("#Github", "theme", themes);
  });
  $("#Merbivore").click(function() {
    change("#Merbivore", "theme", themes);
  });
  $("#Mono_industrial").click(function() {
    change("#Mono_industrial", "theme", themes);
  });
  $("#Monokai").click(function() {
    change("#Monokai", "theme", themes);
  });
  $("#Terminal").click(function() {
    change("#Terminal", "theme", themes);
  });

  /* Font Size */
  $("#size10").click(function() {
    changeSize("#size10", 10, sizes);
  });
  $("#size11").click(function() {
    changeSize("#size11", 11, sizes);
  });
  $("#size12").click(function() {
    changeSize("#size12", 12, sizes);
  });
  $("#size13").click(function() {
    changeSize("#size13", 13, sizes);
  });
  $("#size14").click(function() {
    changeSize("#size14", 14, sizes);
  });
  $("#size16").click(function() {
    changeSize("#size16", 16, sizes);
  });
  $("#size20").click(function() {
    changeSize("#size20", 20, sizes);
  });
  $("#size24").click(function() {
    changeSize("#size24", 24, sizes);
  });

  /* Save Document */
  $("#save_new").click(function() {
    var title = $("#title").val();
    var file = editor.getValue();
    var otherEditors = $("#additionalEditors").val();

    $.post("http://localhost:8080/save_new",
          {title: title, otherEditors: otherEditors, file: file})
          .then(function(data) {
            if (data.err == 0)
              alert("Document Saved");
              $('#savedoc-modal').modal('hide');
          });
  });

  /* Download Document */
  // CODE TO COME
  /*
   *  Socket interactions
   */
  // Dynamically changes code across computers.
  socket.on('changed', function(data) {
    if (data[0] == id) {
      if (data[1] == 0) {
        var pos = editor.session.selection.toJSON();
        holder = 1;
        editor.getSession().setValue(data[2]);
        editor.session.selection.fromJSON(pos);
      }
      else {
        holder = 0;
      }
    }
  });

  socket.on('find_pioneer', function(data) {
    console.log("finding_pioneer");
    // get the current mode
    var mode = editor.session.$modeId;

    // modeid returns the full string (ace/mode/html), cut to the mode name only
    mode = mode.substr(mode.lastIndexOf('/') + 1);
    if (data == id)
      socket.emit('return_info', {info: editor.getSession().getValue(), language: mode});
  });

  socket.on('update', function(data) {
    console.log("updating");
    if (data[0] == id) {
      console.log("setting value to:\n" + data[1]);
      editor.getSession().setValue(data[1]);
      change("#" + data[2], "mode", languages);
    }
  });


  // Socket function to change language.
  socket.on('changeLanguage_', function(data) {
    if (data[1] == id) {
      change(data[0], "mode", languages);
    }
  });
});

// Function to unactivate all other items in the dropdown list
function unactivate(arr) {
  for (var i = 0; i < arr.length; i++)
    $(arr[i]).parent().removeClass("active");
}

// Function to change a theme or language
// Takes in jQuery id as first argument, language/theme as second, array of langauges/themes as third
function change(curr, type, arr) {
  unactivate(arr);
  var temp = "";
  // Removes "#" in front of object name
  for (var i = 1; i < curr.length; i++) {
    if (i == 1) temp += curr[i].toUpperCase();
    else temp += curr[i];
  }
  console.log(temp);
  // Creates string for file to be modified (lower case to avoid file problems)
  var file = ("ace/" + type + "/" + temp).toLowerCase();
  $("#" + temp).parent().addClass("active");
  // Checks if we wanted to change language (editor mode)
  if (type == "mode") {
    editor.session.setMode(file);
    $("#language").html(temp + " <span class='caret'></span>");
  }
  // Checks if we wanted to change theme (editor theme)
  if (type == "theme") {
    editor.setTheme(file);
    $("#theme").html(temp + " <span class='caret'></span>");
  }
}

function changeSize(curr, size, arr) {
  unactivate(arr);
  var temp = ""
  temp += size;
  $(curr).parent().addClass("active");
  editor.setFontSize(size);
  $("#fontsize").html(temp + "px <span class='caret'></span>");
}

// Function to get unique url of documents (will modify when database is set up to save docs)
function getID(url) {
  url = String(url);
  var id = "";
  for (var i = 0; i < 6; i++) {
    id += url[url.length - 6 + i];
  }
  return id;
}
