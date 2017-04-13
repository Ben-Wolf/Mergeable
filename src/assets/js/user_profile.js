// Remove document
function delete_document(id) {
    alert(id);
}


$(document).ready(function() {
  var img = "";
  var curr = "";

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
        listed += '<a href="#" class="list-group-item saved-doc"><h3 class="list-group-item-heading">' + data.documents[i].title + '<button type="button" class="pull-right"><span id="' + data.documents[i]._id + '"class="glyphicon glyphicon-trash" onClick="delete_document(this.id)"></span></button></h3><p class="list-group-item-text">' + data.documents[i].file + '</p></a>\n'
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

  $(".saved-doc").click(function() {
    //not implemented yet.
  });

  // End of document.ready
});
