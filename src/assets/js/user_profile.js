// $(function() {
//
//   var socket = io();
//
//   var email = "";
//   var img = "";
//
//   var propic = $("#propic");
// })

$(document).ready(function() {
  var img = "";
  var socket = io();

  socket.emit('get_info');
  socket.on('send_info', function(data) {
    $("#propic").attr("src", data.avatar);
    $('#name').html(data.firstname + " " + data.lastname);
  });
});
