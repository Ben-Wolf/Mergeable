var curr = "";

$(document).ready(function() {
  var img = "";
  var socket = io();

  $.post("http://localhost:8080/get_info")
  .then(function(data) {
    console.log("4");
    $("#propic").attr("src", data.avatar);
    $('#name').html(data.firstname + " " + data.lastname);
    $('#description').html(data.description);
    var listed = "";

    if (data.documents.length == 0) {
      listed = '<a href="#" class="list-group-item"><h3 class="list-group-item-heading">No Documents Found</h3> <p class="list-group-item-text"></p>Click New and start Coding!</a>\n'
    } else {
      for (var i = 0; i < data.documents.length; i++) {
        listed += '<a href="#" class="list-group-item"><h3 class="list-group-item-heading">' + data.documents[i].title + '</h3> <p class="list-group-item-text"></p>' + data.documents[i].file + '</a>\n'
        console.log(data.documents[i]);
      }
    }

    $('#savedList').html(listed);
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
      $('#description').html('<textarea id="txt" name="txt" class="form-control" style="overflow:auto;resize:none" rows="5">' + curr + '</textarea>');
    }
  });
});
