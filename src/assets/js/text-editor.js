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
  $("#html").click(function() {
    editor.session.setMode("ace/mode/html");
  });
  $("#css").click(function() {
    // $("#html").removeClass("active");
    // $("#javascript").removeClass("active");
    // $(this).addClass("active");
    editor.session.setMode("ace/mode/css");
  });
  $("#javascript").click(function() {
    editor.session.setMode("ace/mode/javascript");
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
