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
    for (i = $timers.length; i < timers.length; i++) {
      nunjucks.render('timer', {}, (function(i) { return function(html) {
        var $timer = $(html.trim());
        updateTimer($timer, timers[i]);
        $timer.appendTo('#timers');
      };})(i));
    }
  } //TODO add delete

  //update timers
  $('.timer').each(function(index) {
    updateTimer($(this), timers[index]);
  });

};

var updateTimer = function($timer, timer) {
  $timer.find('.title').text(timer.title);
  $timer.find('.duration').text(formatTimer(timer.length));
  $timer.find('.remaining').text(formatTimer(timer.remaining));
};


$(document).ready(function() {
  nunjucks.compile('timer', $('#timer-template').html());

  $("#test").click(function() {
    console.log('test');
    background.test();
  });
});