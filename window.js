var background, timers, tmpl;
//get timers
chrome.runtime.getBackgroundPage(function(back) {
  background = back;
  timers = background.timers;
});

var showTimers = function() {
  // dust.render('timer', {timers: timers}, function(err, out) {
  //   $('#timers').html(out);
  // });
  $('#timers').html(tmpl.render());

};


$(document).ready(function() {
  //dust.compileFn($('#timer-template').html(), 'timer');
  tmpl = new nunjucks.Template($('#timer-template').html());
  $("#button").click(function() {
    console.log('test');
    background.test();
  });

  setInterval(showTimers, 1000);
});