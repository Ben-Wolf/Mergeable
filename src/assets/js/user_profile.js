// $(function() {
//
//   var socket = io();
//
//   var email = "";
//   var img = "";
//
//   var propic = $("#propic");
// })
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
    console.log($('#editButton').html());
    if ($('#editButton').html() == '<a href="#"><span class="glyphicon glyphicon-plus"></span> Save</a>') {
      var temp = $('#description').html();
      console.log($('#description').val());
      curr = "";
      for (var i = '<textarea class="form-control" rows="5">'.length; i != 2000; i++) {
        console.log(temp[i]);
        if (temp[i] == "<") {
          console.log("breaking");
          break;
        }
        curr += temp[i];
      }
      $('#description').html(curr);
      $('#editButton').html('<a href="#"><span class="glyphicon glyphicon-plus"></span> Edit</a>');
    }
    else {
      $('#editButton').html('<a href="#"><span class="glyphicon glyphicon-plus"></span> Save</a>');
      curr = $('#description').html();
      $('#description').html('<textarea class="form-control" rows="5">' + curr + '</textarea>');
    }
  });
});
