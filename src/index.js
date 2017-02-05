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

$(document).ready(function() {
  $(".buttons").hide();
  type();
  setInterval ('cursorAnimation()', 500);

  // Automatic scrolling
  $('a[href^="#"]').on('click',function (e) {
	    e.preventDefault();

	    var target = this.hash;
	    var $target = $(target);

	    $('html, body').stop().animate({
	        'scrollTop': $target.offset().top
	    }, 900, 'swing', function () {
	        window.location.hash = target;
	    });
	});

});
