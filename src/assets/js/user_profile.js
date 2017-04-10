var curr = "";

$(document).ready(function() {
  var img = "";
  var socket = io();

  socket.emit('get_info');
  socket.on('send_info', function(data) {
    $("#propic").attr("src", data.avatar);
    $('#name').html(data.firstname + " " + data.lastname);
    $('#description').html(data.description);
  });

  $("#editButton").click(function() {
    if ($('#editButton').html() == '<a href="#"><span class="glyphicon glyphicon-plus"></span> Save</a>') {
      var temp = $('#description').html();
      curr = $('textarea#txt').val();
      $('#description').html(curr);
      $('#editButton').html('<a href="#"><span class="glyphicon glyphicon-plus"></span> Edit</a>');
      $.post("http://localhost:8080/save_description",
        {description: curr});
    }
    else {
      $('#editButton').html('<a href="#"><span class="glyphicon glyphicon-plus"></span> Save</a>');
      curr = $('#description').html();
      $('#description').html('<textarea id="txt" name="txt" class="form-control" rows="5">' + curr + '</textarea>');
    }
  });
});
