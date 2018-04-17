var editor = ace.edit("editor");
var currentLang = "Javascript";
var baseUrl = "http://localhost:8080";
var saved_title = "MergeableDoc";
editor.setTheme("ace/theme/monokai");
editor.session.setMode("ace/mode/javascript");
editor.getSession().setValue("Your code here");
editor.$blockScrolling = Infinity;


$(document).ready(function() {
  // Access the socket
  var socket = io();
  var id = getID(window.location.pathname);
  var holder = 0;

  var callSave = function() {
    var title = $("#title").val();
    var description = $("#description").val();
    var file = editor.getValue();
    var otherEditors = $("#additionalEditors").val();
    var mode = editor.session.$modeId;
    var hidden = ($('#private').is(':checked'));
    mode = mode.substr(mode.lastIndexOf('/') + 1);

    $.post(baseUrl + "/save_new",
          {title: title, otherEditors: otherEditors, description: description, file: file, language: mode, hidden: hidden})
          .then(function(data) {
            if (data.err == 0) {
              $("#savedAlert").modal("show");
              $('#savedoc-modal').modal('hide');
            }
            else {
              $("#titleAlert").modal("show");
            }
          })
          .fail(function() {
            $("#signin-modal").modal('show');
          });
  }

  // Load in all our modals
  $("#titleAlert").load("html/text-editor/title-alert.html");
  $("#savedAlert").load("html/text-editor/saved-alert.html");
  $("#signinAlert").load("html/text-editor/signin-alert.html");
  $("#registerAlert").load("html/text-editor/register-alert.html");
  // $("#signinModal").load("html/signin-modal.html");

  // Updates editor info if trying to load a document
  if (id.length > 10) {
    $.post("populate_editor", {id: id})
    .then(function(data) {
      var title = data.title;
      var file = data.file;
      var lang = data.lang;
      if (data.permission) {
        editor.getSession().setValue(file);
        $("#fileTitle").html(title);
        change(lang, "mode", languages);
        $("body").removeClass("loading");
      }
      else {
        $.post("check_id", {id: id})
        .then(function(e) {
          if (e.permission) {
            editor.getSession().setValue(file);
            $("#fileTitle").html(title);
            change(lang, "mode", languages);
            $("body").removeClass("loading");
          }
          else {
            alert("You do not have adequate permissions to access this file.");
            window.location.href = "/new"
          }
        })
      }
    });
  }
  else {
    $("body").removeClass("loading");
  }

  // Will use this to check for permissions in future?
  // Currently sets the first person to work on a file as "pioneer"
  socket.emit("checkID", id);

  // Function that sends changes to the editor to multiple viewers
  editor.getSession().on('change', function(e) {
    data = [id, holder, editor.getSession().getValue()];
    socket.emit('change', data);
  });


  // Arrays to hold all the elements in each drop down list.
  var languages = ["#CSharp", "#CSS", "#HTML", "#Java", "#JavaScript", "#Python", "#TypeScript", "#c_cpp"];
  var themes = ["#Chrome", "#Clouds", "#Cobalt", "#Eclipse", "#Github", "#Merbivore", "#Mono_industrial", "#Monokai", "#Terminal"];
  var sizes = ["#size10", "#size11", "#size12", "#size13", "#size14", "#size16", "#size20", "#size24", "#size30", "#size48"];

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
  $("#c_cpp").click(function() {
    socket.emit("changeLanguage", ["#c_cpp", id]);
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
  $("#size30").click(function() {
    changeSize("#size30", 30, sizes);
  });
  $("#size48").click(function() {
    changeSize("#size48", 48, sizes);
  });

  $("#run").click(function() {
    var code = editor.getValue();
    alert($("#JavaScript").hasClass("active"));
    if ($("#JavaScript").hasClass("active")) {
      alert(eval(code));
    }

    else {
      alert("Currently only supports JavaScript");
    }
  });

  // Saves document for user and all other editors
  $("#save_new").click(function() {
    saved_title = $("#title").val();
    var title = $("#title").val();
    var description = $("#description").val();
    var file = editor.getValue();
    var otherEditors = $("#additionalEditors").val();
    var mode = editor.session.$modeId;
    var hidden = ($('#private').is(':checked'));
    mode = mode.substr(mode.lastIndexOf('/') + 1);

    $.post(baseUrl + "/save_new",
          {title: title, otherEditors: otherEditors, description: description, file: file, lang: mode, hidden: hidden})
          .then(function(data) {
            if (data.err == 0)
              alert("Document Saved");
              $('#savedoc-modal').modal('hide');
          });
  });

  // Updates a previously saved document
  $("#save").click(function() {
    if(id.length < 10) alert("Document can't be updated. Please 'Save As' first.");
    else {
      var file = editor.getValue();
      var mode = editor.session.$modeId;
      mode = mode.substr(mode.lastIndexOf('/') + 1);

      $.post(baseUrl + "/save", {id: id, file: file, lang: mode})
      .then(function(data) {
        window.location.href = "/editor-" + data;
      });
    }
  });

  // Document downloading as found from http://cwestblog.com/2014/10/21/javascript-creating-a-downloadable-file-in-the-browser/
  setupDownloadLink = function(link) {
    var code = editor.getValue();

    if(currentLang == "Javascript"){
      link.href = 'data:plain/text;charset=utf-8,' + encodeURIComponent(code);
      link.download = saved_title + ".js"
    }
    else if(currentLang == "C_cpp"){
      link.href = 'data:text/octet-stream;charset=utf-8,' + encodeURIComponent(code);
      link.download = saved_title + ".cpp"
    }
    else if(currentLang == "Python"){
      link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(code);
      link.download = saved_title + ".py"
    }
    else if(currentLang == "CSharp"){
      link.href = 'data:text/octet-stream;charset=utf-8,' + encodeURIComponent(code);
      link.download = saved_title + ".NET"
    }
    else if(currentLang == "CSS"){
      link.href = 'data:text/octet-stream;charset=utf-8,' + encodeURIComponent(code);
      link.download = saved_title + ".css"
    }
    else if(currentLang == "HTML"){
      link.href = 'data:text/octet-stream;charset=utf-8,' + encodeURIComponent(code);
      link.download = saved_title + ".html"
    }
    else if(currentLang == "Java"){
      link.href = 'data:text/octet-stream;charset=utf-8,' + encodeURIComponent(code);
      link.download = saved_title + ".java"
    }
    else if(currentLang == "TypeScript"){
      link.href = 'data:text/octet-stream;charset=utf-8,' + encodeURIComponent(code);
      link.download = saved_title + ".ts"
    }
    else{
      link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(code);
    }

  };

  // Function to change a theme or language
  // Takes in jQuery id as first argument, language/theme as second, array of langauges/themes as third
  function change(curr, type, arr) {
    unactivate(arr);
    var temp = "";
    // Removes "#" in front of object name
    if (curr[0] == "#") {
      for (var i = 1; i < curr.length; i++) {
        if (i == 1) temp += curr[i].toUpperCase();
        else temp += curr[i];
      }
    }
    else {
      for (var i = 0; i < curr.length; i++) {
        if (i == 0) temp += curr[i].toUpperCase();
        else temp += curr[i];
      }
    }
    // Creates string for file to be modified (lower case to avoid file problems)
    var file = ("ace/" + type + "/" + temp).toLowerCase();
    $("#" + temp).parent().addClass("active");
    // Checks if we wanted to change language (editor mode)
    if (type == "mode") {
      currentLang = temp;
      editor.session.setMode(file);
      $("#language").html(temp + " <span class='caret'></span>");
    }
    // Checks if we wanted to change theme (editor theme)
    if (type == "theme") {
      editor.setTheme(file);
      $("#theme").html(temp + " <span class='caret'></span>");
    }
  }

  // Function to change size
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
    for (var i = 8; i < url.length; i++) {
      id += url[i];
    }
    return id;
  }

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
    // get the current mode
    var mode = editor.session.$modeId;

    // modeid returns the full string (ace/mode/html), cut to the mode name only
    mode = mode.substr(mode.lastIndexOf('/') + 1);
    if (data == id)
      socket.emit('return_info', {info: editor.getSession().getValue(), language: mode});
  });

  socket.on('update', function(data) {
    if (data[0] == id) {
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
