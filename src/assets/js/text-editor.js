var editor = ace.edit("editor");
var socket = io();
editor.setTheme("ace/theme/monokai");
editor.session.setMode("ace/mode/javascript");
editor.getSession().setValue("Your code here");

// Function to unactivate all other items in the dropdown list
function unactivate(arr) {
  for (var i = 0; i < arr.length; i++) {
    $(arr[i]).parent().removeClass("active");
  }
}

socket.on('changed', function(data) {
  console.log(data);
  editor.getSession().setValue(data);
});

// Function to get unique url of documents (will modify when database is set up to save docs)
function getID(url) {
  url = String(url);
  var id = "";
  for (var i = 0; i < 6; i++) {
    id += url[url.length - 6 + i];
  }
  return id;
}

$(document).ready(function() {
  // Access the socket
  var id = getID(window.location.pathname);

  socket.emit("checkID", id);

  // Function that sends changes to the editor to multiple viewers
  editor.getSession().on('change', function(e) {
    data = editor.getSession().getValue();
    // socket.emit('change', data);
  });

  // Arrays to hold all the elements in each drop down list.
  var languages = ["#csharp", "#css", "#html", "#java", "#javascript", "#python", "#typescript"];
  var themes = ["#chrome", "#clouds", "#cobalt", "#eclipse", "#github", "#merbivore", "#mono_industrial", "#monokai", "#terminal"];
  var sizes = ["#size10", "#size11", "#size12", "#size13", "#size14", "#size16", "#size20", "#size24"];

  /* Language Options */
  $("#csharp").click(function() {
    unactivate(languages);
    $(this).parent().addClass("active");
    editor.session.setMode("ace/mode/csharp");
    $("#language").html("C# <span class='caret'></span>");
  });
  $("#css").click(function() {
    unactivate(languages);
    $(this).parent().addClass("active");
    editor.session.setMode("ace/mode/css");
    $("#language").html("CSS <span class='caret'></span>");
  });
  $("#html").click(function() {
    unactivate(languages);
    $(this).parent().addClass("active");
    editor.session.setMode("ace/mode/html");
    $("#language").html("HTML <span class='caret'></span>");
  });
  $("#java").click(function() {
    unactivate(languages);
    $(this).parent().addClass("active");
    editor.session.setMode("ace/mode/java");
    $("#language").html("Java <span class='caret'></span>");
  });
  $("#javascript").click(function() {
    unactivate(languages);
    $(this).parent().addClass("active");
    editor.session.setMode("ace/mode/javascript");
    $("#language").html("JavaScript <span class='caret'></span>");
  });
  $("#python").click(function() {
    unactivate(languages);
    $(this).parent().addClass("active");
    editor.session.setMode("ace/mode/python");
    $("#language").html("Python <span class='caret'></span>");
  });
  $("#typescript").click(function() {
    unactivate(languages);
    $(this).parent().addClass("active");
    editor.session.setMode("ace/mode/typescript");
    $("#language").html("TypeScript <span class='caret'></span>");
  });

  /* Theme Options */
  $("#chrome").click(function() {
    unactivate(themes);
    $(this).parent().addClass("active");
    editor.setTheme("ace/theme/chrome");
  });
  $("#clouds").click(function() {
    unactivate(themes);
    $(this).parent().addClass("active");
    editor.setTheme("ace/theme/clouds");
  });
  $("#cobalt").click(function() {
    unactivate(themes);
    $(this).parent().addClass("active");
    editor.setTheme("ace/theme/cobalt");
  });
  $("#eclipse").click(function() {
    unactivate(themes);
    $(this).parent().addClass("active");
    editor.setTheme("ace/theme/eclipse");
  });
  $("#github").click(function() {
    unactivate(themes);
    $(this).parent().addClass("active");
    editor.setTheme("ace/theme/github");
  });
  $("#merbivore").click(function() {
    unactivate(themes);
    $(this).parent().addClass("active");
    editor.setTheme("ace/theme/merbivore");
  });
  $("#mono_industrial").click(function() {
    unactivate(themes);
    $(this).parent().addClass("active");
    editor.setTheme("ace/theme/mono_industrial");
  });
  $("#monokai").click(function() {
    unactivate(themes);
    $(this).parent().addClass("active");
    editor.setTheme("ace/theme/monokai");
  });
  $("#terminal").click(function() {
    unactivate(themes);
    $(this).parent().addClass("active");
    editor.setTheme("ace/theme/terminal");
  });

  /* Font Size */
  $("#size10").click(function() {
    unactivate(sizes);
    $(this).parent().addClass("active");
    editor.setFontSize(10);
    $("#fontsize").html("10px <span class='caret'></span>");
  });
  $("#size11").click(function() {
    unactivate(sizes);
    $(this).parent().addClass("active");
    editor.setFontSize(11);
    $("#fontsize").html("11px <span class='caret'></span>");
  });
  $("#size12").click(function() {
    unactivate(sizes);
    $(this).parent().addClass("active");
    editor.setFontSize(12);
    $("#fontsize").html("12px <span class='caret'></span>");
  });
  $("#size13").click(function() {
    unactivate(sizes);
    $(this).parent().addClass("active");
    editor.setFontSize(13);
    $("#fontsize").html("13px <span class='caret'></span>");
  });
  $("#size14").click(function() {
    unactivate(sizes);
    $(this).parent().addClass("active");
    editor.setFontSize(14);
    $("#fontsize").html("14px <span class='caret'></span>");
  });
  $("#size16").click(function() {
    unactivate(sizes);
    $(this).parent().addClass("active");
    editor.setFontSize(16);
    $("#fontsize").html("16px <span class='caret'></span>");
  });
  $("#size20").click(function() {
    unactivate(sizes);
    $(this).parent().addClass("active");
    editor.setFontSize(20);
    $("#fontsize").html("20px <span class='caret'></span>");
  });
  $("#size24").click(function() {
    unactivate(sizes);
    $(this).parent().addClass("active");
    editor.setFontSize(24);
    $("#fontsize").html("24px <span class='caret'></span>");
  });

  /* Save Document */
  // CODE TO COME
  /* Download Document */
  // CODE TO COME
  /* COLLABORATION */
  socket.on('connection', function(socket) {

    console.log("User connected");
  });
});
