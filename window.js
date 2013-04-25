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
  $timer.data('timer', timer);
  $timer.find('.title').text(timer.title);
  $timer.find('.duration').text(formatTimer(timer.length));
  $timer.find('.remaining').text(formatTimer(timer.remaining));

  var $startButton = $timer.find('.startstop');
  if (timer.running) {
    $startButton.text('pause');
  } else {
    if (timer.remaining === timer.length || timer.remaining === 0) {
      $startButton.text('start');
    } else {
      $startButton.text('resume');
    }
  }
  $startButton.prop('disabled', timer.remaining === 0);

  $timer.find('.reset').prop('disabled', timer.remaining === timer.length);
};

var startStop = function() {
  var $timer = $(this).closest('.timer'),
      timer = $timer.data('timer');
  timer.running = !timer.running;
  updateTimer($timer, timer);
};

var reset = function() {
  var $timer = $(this).closest('.timer'),
      timer = $timer.data('timer');
  timer.remaining = timer.length;
  timer.running = false;
  updateTimer($timer, timer);
};

var closeEdit = function() {
  var $timer = $(this).closest('.timer'),
      timer = $timer.data('timer'),
      $edit = $timer.find('.edit-container');
  timer.title = $edit.find('.edit-title').val();
  var newLen = parseTimer($edit.find('.edit-duration').val());
  if (timer.length != newLen) {
    timer.remaining = newLen;
    timer.running = false;
  }
  timer.length = newLen;
  updateTimer($timer, timer);
  $edit.animate({ top: -$edit.outerHeight() });
};

var openEdit = function() {
  var $timer = $(this).closest('.timer'),
      timer = $timer.data('timer'),
      $edit = $timer.find('.edit-container');
  $edit.find('.edit-title').val(timer.title);
  $edit.find('.edit-duration').val(formatTimer(timer.length));
  $edit.animate({ top: 0 });
};

//connect to the background page to keep it awake
chrome.runtime.connect();

$(document).ready(function() {
  nunjucks.compile('timer', $('#timer-template').html());

  $('#test').click(function() {
    console.log('test');
    background.test();
  });

  $('#timers')
    .on('click', 'button.startstop', startStop)
    .on('click', 'button.reset', reset)
    .on('click', '.close', closeEdit)
    .on('click', '.edit-button', openEdit);
});