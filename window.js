//TODO: cancel edit

var background, timers, tmpl;

//get timers
chrome.runtime.getBackgroundPage(function(back) {
  background = back;
  timers = background.timers;
  background.addWindow(window);
});

var updateTimers = function() {
  var $timers = $('#timers .timer'), i;
  //check for new timers
  if ($timers.length < timers.length) {
    for (i = $timers.length; i < timers.length; i++) {
      nunjucks.render('timer', {}, (function(i) { return function(html) {
        var $timer = $(html.trim());
        $timer.data('timer', timers[i]);
        updateTimer($timer);
        var isNew = (newTimer === timers[i]);
        $timer.hide().appendTo('#timers').show(function() {
          if (isNew) {
            openEdit($timer);
            newTimer = null;
          }
          $timer.focus();
        });
      };})(i));
    }
  }

  //TODO: check for removed timers

  //update timers
  $('#timers .timer').each(function(index) {
    var $timer = $(this);
    if (timers.indexOf($timer.data('timer')) === -1) {
      $timer.hide(function() { $timer.remove(); });
    } else {
      updateTimer($(this));
    }
  });

};

var updateTimer = function($timer) {
  var timer = $timer.data('timer');
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

var startStop = function($timer) {
  var timer = $timer.data('timer');
  timer.running = !timer.running;
  updateTimer($timer);
};

var reset = function($timer) {
  var timer = $timer.data('timer');
  timer.remaining = timer.length;
  timer.running = false;
  updateTimer($timer);
};

var closeEdit = function($timer) {
  var timer = $timer.data('timer'),
      $edit = $timer.find('.edit-container');
  timer.title = $edit.find('.edit-title').val();
  var newLen = parseTimer($edit.find('.edit-duration').val());
  if (timer.length != newLen) {
    timer.remaining = newLen;
    timer.running = false;
  }
  timer.length = newLen;
  updateTimer($timer);
  $timer.focus();
  $edit.animate({ top: -$edit.outerHeight() });
};

var openEdit = function($timer) {
  var timer = $timer.data('timer'),
      $edit = $timer.find('.edit-container');
  $edit.find('.edit-title').val(timer.title);
  $edit.find('.edit-duration').val(formatTimer(timer.length)).focus().select();
  $edit.animate({ top: 0 });
};

var newTimer = null;
var addTimer = function() {
  newTimer = background.newTimer();
  updateTimers();
};

var removeTimer = function() {
  var $timer = $(this).closest('.timer'),
      timer = $timer.data('timer');
  background.deleteTimer(timer);
  updateTimers();
};

var editKeypress = function(event) {
  if (event.which == 13) {
    closeEdit($(this).closest('.timer'));
  }
};

var timerKeydown = function(event) {
  if ($(document.activeElement).is('input')) return;
  var $timer = $(this);

  switch (event.which) {
  case 37: //left arrow
    $timer.prev().focus();
    event.preventDefault();
    break;
  case 39: //right arrow
    $timer.next().focus();
    event.preventDefault();
    break;
  case 69: //e
    openEdit($timer);
    event.preventDefault();
    break;
  case 82: //r
    if (!event.metaKey) {
      reset($timer);
      event.preventDefault();
    }
    break;
  case 32: //space
    startStop($timer);
    event.preventDefault();
    break;
  }
};

//connect to the background page to keep it awake
chrome.runtime.connect();

$(document).ready(function() {
  nunjucks.compile('timer', $('#timer-template').html());

  $('#timers')
    .on('click', 'button.startstop', function() {
      startStop($(this).closest('.timer'));
    })
    .on('click', 'button.reset', function() {
      reset($(this).closest('.timer'));
    })
    .on('click', '.close', function() {
      closeEdit($(this).closest('.timer'));
    })
    .on('click', '.edit-button', function() {
        openEdit($(this).closest('.timer'));
      })
    .on('click', '.delete-button', removeTimer)
    .on('keypress', 'input', editKeypress)
    .on('keydown', '.timer', timerKeydown);

  $('#new-timer').click(addTimer);

  $('body').keydown(winKeydown);

});
