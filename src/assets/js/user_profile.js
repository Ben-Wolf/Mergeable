var delete_document;
var baseUrl = "http://localhost:8080";

$(document).ready(function() {
  var img = "";
  var curr = "";

  // Remove document
  delete_document = function (id) {
    $.post(baseUrl + "/remove_document", {id: id})
    .then(function(data) {
      window.location.reload();
    });
  }

  // Edit document details
  edit_details = function(id) {
    $.post(baseUrl +"/get_doc_info", {id: id})
    .then(function(data) {
      $("#documentName").attr('placeholder', data.title);
      $("#documentDescription").attr('placeholder', data.description);
      var editors = "";
      for (var i = 0; i < data.otherEditors.length; i++) {
        if (i != data.otherEditors.length - 1) editors += data.otherEditors[i] + ", ";
        else editors += data.otherEditors[i];
      }
      $("#editors").attr('placeholder', editors);
      if (data.hidden) {
        $("#private").prop('checked', true);
      }
    });
    $("#editModal").modal("show");
  }

  // Update a document after editing document details
  $("#updateDocument").click(function() {

  });

  // Populate the user profile page with all the saved and shared documents, propic, name and description.
  $.post(baseUrl + "/get_info")
  .then(function(data) {
    $("#propic").attr("src", data.avatar);
    $('#name').text(data.firstname + " " + data.lastname);
    $('#description').text(data.description);
    var listed = "";

    if (data.documents.length == 0) {
      listed = '<a href="/new" class="list-group-item"><h3 class="list-group-item-heading">No Documents Found</h3> <p class="list-group-item-text"></p>Click New and start Coding!</a>\n'
    } else {
      for (var i = 0; i < data.documents.length; i++) {
        listed += '<div class="list-group-item saved-doc"><a href="/editor-' + data.documents[i]._id + '"><h3 class="list-group-item-heading">' + data.documents[i].title + '</a><button type="button" class="pull-right"><span id="' + data.documents[i]._id + '"class="glyphicon glyphicon-trash" onClick="delete_document(this.id)"></span></button><button type="button" class="pull-right"><span id="' + data.documents[i]._id + '" class="glyphicon glyphicon-wrench" onClick="edit_details(this.id)"></span></button></h3><p id=' + data.documents[i]._id + ' class="list-group-item-text">' + data.documents[i].description + '</p></div>\n';
      }
    }

    var sharedList = "";

    if (data.sharedDocuments.length == 0) {
      $("#shared").hide();
    }
    for (var i = 0; i < data.sharedDocuments.length; i++) {
      sharedList += '<div class="list-group-item saved-doc"><a href="/editor-' + data.sharedDocuments[i]._id + '"><h3 class="list-group-item-heading">' + data.sharedDocuments[i].title + '</a><button type="button" class="pull-right"><span id="' + data.sharedDocuments[i]._id + '"class="glyphicon glyphicon-trash" onClick="delete_document(this.id)"></span></button><button type="button" class="pull-right"><span id="' + data.sharedDocuments[i]._id + '" class="glyphicon glyphicon-wrench" onClick="edit_details(this.id)"></span></button></h3><p id=' + data.sharedDocuments[i]._id + ' class="list-group-item-text">' + data.sharedDocuments[i].description + '</p></div>\n';
    }

    $('#savedList').html(listed);
    $('#sharedList').html(sharedList);
    $("body").removeClass("loading");
  })
  // If a user who is not logged in tries to access a profile page -- redirect to login
  .fail(function(data) {
    alert("You are not logged in.");
    window.location.href = "/";
  });

  // Edit the user profile description
  $("#editButton").click(function() {
    if ($('#editButton').html() == '<a href="#"><span class="glyphicon glyphicon-plus"></span> Save</a>') {
      var temp = $('#description').html();
      curr = $('textarea#txt').val();
      $('#description').html(curr);
      $('#editButton').html('<a href="#"><span class="glyphicon glyphicon-plus"></span> Edit</a>');
      $.post(baseUrl + "/save_description",
        {description: curr});
    }
    else {
      $('#editButton').html('<a href="#"><span class="glyphicon glyphicon-plus"></span> Save</a>');
      curr = $('#description').html();
      $('#description').html('<textarea id="txt" name="txt" class="form-control" style="overflow:auto;resize:none" rows="5">' + curr + '</textarea>');
    }
  });
  // End of document.ready
});
