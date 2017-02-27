var editor = ace.edit("editor");

editor.setTheme("ace/theme/monokai");
editor.session.setMode("ace/mode/javascript");
editor.getSession().setValue("Your code here");

var input = $('input[name="code"]');
    editor.getSession().on("change", function() {
    input.val(editor.getSession().getValue());
});

editor.getSession().on('change', function(e) {


});
