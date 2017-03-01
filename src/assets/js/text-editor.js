var editor = ace.edit("editor");

// Function that sends changes to the editor to multiple viewers
editor.getSession().on('change', function(e) {


});

// Function to unactivate all other items in the dropdown list
function unactivate(arr) {
  for (var i = 0; i < arr.length; i++) {
    $(arr[i]).parent().removeClass("active");
  }
}

$(document).ready(function() {

  editor.setTheme("ace/theme/merbivore");
  editor.session.setMode("ace/mode/javascript");
  editor.getSession().setValue("Your code here");

  // Arrays to hold all the elements in each drop down list.
  var languages = ["#csharp", "#css", "#html", "#java", "#javascript", "#python", "#typescript"];
  var themes = ["#chrome", "#clouds", "#cobalt", "#eclipse", "#github", "#merbivore", "#mono_industrial", "#monokai", "#terminal"];

  /* Language Options */
  $("#csharp").click(function() {
    unactivate(languages);
    $(this).parent().addClass("active");
    editor.session.setMode("ace/mode/csharp");
  });
  $("#css").click(function() {
    unactivate(languages);
    $(this).parent().addClass("active");
    editor.session.setMode("ace/mode/css");
  });
  $("#html").click(function() {
    unactivate(languages);
    $(this).parent().addClass("active");
    editor.session.setMode("ace/mode/html");
  });
  $("#java").click(function() {
    unactivate(languages);
    $(this).parent().addClass("active");
    editor.session.setMode("ace/mode/java");
  });
  $("#javascript").click(function() {
    unactivate(languages);
    $(this).parent().addClass("active");
    editor.session.setMode("ace/mode/javascript");
  });
  $("#python").click(function() {
    unactivate(languages);
    $(this).parent().addClass("active");
    editor.session.setMode("ace/mode/python");
  });
  $("#typescript").click(function() {
    unactivate(languages);
    $(this).parent().addClass("active");
    editor.session.setMode("ace/mode/typescript");
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

  /* Save Document */

  /* Download Document */
});
