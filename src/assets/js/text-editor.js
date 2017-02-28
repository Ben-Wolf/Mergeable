var editor = ace.edit("editor");

var input = $('input[name="code"]');
  editor.getSession().on("change", function() {
  input.val(editor.getSession().getValue());
});

editor.getSession().on('change', function(e) {


});

$(document).ready(function() {

  editor.setTheme("ace/theme/monokai");
  editor.session.setMode("ace/mode/javascript");
  editor.getSession().setValue("Your code here");

  /* Language Options */
  $("#csharp").click(function() {
    editor.session.setMode("ace/mode/csharp");
  });
  $("#css").click(function() {
    // $("#html").removeClass("active");
    // $("#javascript").removeClass("active");
    // $(this).addClass("active");
    editor.session.setMode("ace/mode/css");
  });
  $("#html").click(function() {
    editor.session.setMode("ace/mode/html");
  });
  $("#java").click(function() {
    editor.session.setMode("ace/mode/java");
  });
  $("#javascript").click(function() {
    editor.session.setMode("ace/mode/javascript");
  });
  $("#python").click(function() {
    editor.session.setMode("ace/mode/python");
  });
  $("#typescript").click(function() {
    editor.session.setMode("ace/mode/typescript");
  });

  /* Theme Options */
  $("#eclipse").click(function() {
    editor.setTheme("ace/theme/eclipse");
  });
  $("#cobalt").click(function() {
    editor.setTheme("ace/theme/cobalt");
  });
  $("#monokai").click(function() {
    editor.setTheme("ace/theme/monokai");
  });
});
