logo = "Mergeable"
i = 0;

$(document).ready(function() {
    type();
    setInterval ('cursorAnimation()', 500);
});

function cursorAnimation() {
    $('#cursor').animate({
        opacity: 0
    }, 'slow', 'swing').animate({
        opacity: 1
    }, 'slow', 'swing');
}

function type() {
  $('#logo').html(logo.substr(0, i++));
  if (i < 10) {
    setTimeout(type, 350)
  }
}
