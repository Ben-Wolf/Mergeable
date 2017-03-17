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

  socket.emit('get_avatar');
  socket.on('send_avatar', function(data) {
    $("#propic").attr("src", data);
  });
});
