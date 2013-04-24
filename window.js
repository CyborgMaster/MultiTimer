var background, timers, tmpl;
//get timers
chrome.runtime.getBackgroundPage(function(back) {
  background = back;
  timers = background.timers;
});

var showTimers = function() {
  console.log('rendering');
  nunjucks.render('timer', {timers: timers}, function(html) {
    $('#timers').html(html);
  });
};


$(document).ready(function() {
  nunjucks.compile('timer', $('#timer-template').html());
  $("#button").click(function() {
    console.log('test');
    background.test();
  });

  setInterval(showTimers, 1000);
});