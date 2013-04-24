var background, timers, tmpl;

//get timers
chrome.runtime.getBackgroundPage(function(back) {
  background = back;
  timers = background.timers;
  background.addWindow(window);
});

var updateTimers = function() {
  var $timers = $('.timer'), i;
  //check for new timers
  if ($timers.length < timers.length) {
    for (i = 0; i < timers.length - $timers.length; i++) {
      nunjucks.render('timer', {timer: timers[0]}, function(html) {
        $(html.trim()).appendTo('#timers');
      });
    }
  } //TODO add delete

  //update timers
  $('.timer').each(function(index) {
    var $timer = $(this), timer = timers[index];
    $timer.find('.remaining').text(timer.remaining);
  });

};


$(document).ready(function() {
  nunjucks.compile('timer', $('#timer-template').html());

  $("#test").click(function() {
    console.log('test');
    background.test();
  });
});