var logo = "Mergeable"
var i = 0;

function cursorAnimation() {
    $('#cursor').animate({
        opacity: 0
    }, 'slow', 'swing').animate({
        opacity: 1
    }, 'slow', 'swing');
}

function showButtons() {
  $(".buttons").fadeIn();
}

function type() {
  $('#logo').html(logo.substr(0, i++));
  if (i < 10) {
    setTimeout(type, 100)
  }
  if (i==10) {
    setTimeout(showButtons, 100)
  }
}

// Makes sure the e-mail provided is valid.
function isValid(email) {
  email = String(email);
  for(i = 0; i < email.length; i++) {
    if (email[i] == "@") {
      for(var j = i; j < email.length; j++) {
        if (email[j] == ".") {
          return true;
        }
      }
    }
  }
  return false;
}

$(document).ready(function() {
  $(".buttons").hide();
  $("#page2").hide();
  $("#page3").hide();
  type();
  setInterval ('cursorAnimation()', 500);
  var socket = io();

// Show Sign In Page and Automatically Scroll Down
  $("#sign_in_btn").click(function() {
    $("#page3").hide();
    $("#page2").show();

    var target = this.hash;
    var $target = $(target);

    $('html, body').stop().animate({
        'scrollTop': $target.offset().top
    }, 900, 'swing', function () {
        window.location.hash = target;
    });
  });

// Show Create Account Page and Automatically Scroll Down
  $("#create_account_btn").click(function() {
    $("#page2").hide();
    $("#page3").show();

    var target = this.hash;
    var $target = $(target);

    $('html, body').stop().animate({
        'scrollTop': $target.offset().top
    }, 900, 'swing', function () {
        window.location.hash = target;
    });
  });

// Give the user an error if they don't enter a valid email/password
// Sends user info to server
  $("#submit").click(function() {
    if ($("#pass").val().length < 8) {
      alert("Invalid password.");
    }
    else if (isValid($("#email").val()) == false) {
      alert("Invalid email.");
    }
    else {
      socket.emit('login', $("#email").val());
    }
    var email = $("#email").val();
    var password = $("#pass").val();
    $.post("http://localhost:8080/login", {email: email, password: password})
    .then(function(data) {
      window.location.href = data.redirectUrl;
    });
  });

  $(".login-input").keypress(function(e) {
    if (e.which == 13) {
      if ($("#pass").val().length < 8) {
        alert("Invalid password.");
      }
      else if (isValid($("#email").val()) == false) {
        alert("Invalid email.");
      }
      else {
        socket.emit('login', $("#email").val());
      }
      var email = $("#email").val();
      var password = $("#pass").val();
      $.post("http://localhost:8080/login", {email: email, password: password})
      .then(function(data) {
        window.location.href = data.redirectUrl;
      });
    }
  })

// Make sure all fields are accurate when a user tries to create an Account
// Sends info and creates new user in database
  $("#create").click(function() {
    if($("#pwd").val().length < 8) {
      alert("Passwords must be at least 8 characters.");
    }
    else if ($("#pwd").val() != $("#pwd2").val()) {
      alert("Passwords do not match.");
    }
    else if ($("#f_name").val() < 1 || $("#l_name").val() < 1) {
      alert("First and last name must be at least one character");
    }
    else if (isValid($("#e_mail").val()) == false) {
      alert("Please enter a valid e-mail");
    }
    else {
      socket.emit('login', $("#e_mail").val());
    }

    var f_name = $("#f_name").val();
    var l_name = $("#l_name").val();
    var e_mail = $("#e_mail").val();
    var pwd = $("#pwd").val();
    var pwd2 = $("#pwd2").val();
    $.post("http://localhost:8080/create",
      {f_name: f_name, l_name: l_name, e_mail: e_mail, pwd: pwd, pwd2: pwd2})
      .then(function(data) {
        window.location.href = data.redirectUrl;
      });
  });

$(".create-input").keypress(function(e) {
  if (e.which == 13) {
    if($("#pwd").val().length < 8) {
      alert("Passwords must be at least 8 characters.");
    }
    else if ($("#pwd").val() != $("#pwd2").val()) {
      alert("Passwords do not match.");
    }
    else if ($("#f_name").val() < 1 || $("#l_name").val() < 1) {
      alert("First and last name must be at least one character");
    }
    else if (isValid($("#e_mail").val()) == false) {
      alert("Please enter a valid e-mail");
    }
    else {
      socket.emit('login', $("#e_mail").val());
    }

    var f_name = $("#f_name").val();
    var l_name = $("#l_name").val();
    var e_mail = $("#e_mail").val();
    var pwd = $("#pwd").val();
    var pwd2 = $("#pwd2").val();
    $.post("http://localhost:8080/create",
      {f_name: f_name, l_name: l_name, e_mail: e_mail, pwd: pwd, pwd2: pwd2})
      .then(function(data) {
        window.location.href = data.redirectUrl;
      });
  }
});


  //End of document ready
});
