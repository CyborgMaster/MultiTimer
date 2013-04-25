var timers = [];
var windows = [];

chrome.app.runtime.onLaunched.addListener(function() {
  window.open('window.html');
});
chrome.runtime.onSuspend.addListener(function() {
  console.log('Suspended!!!');
});

//connection for keeping background page awake
chrome.runtime.onConnect.addListener(function(port) {
  console.log('connected');
});


var lastCheck = +(new Date());
var checkTimers = function() {
  var timerNum, timer, i,
      now = +(new Date()),
      elapsed = now - lastCheck;

  for (i = 0; i < timers.length; i++) {
    timer = timers[i];
    if (timer.running) {
      timer.remaining -= elapsed;
      if (timer.remaining <= 0) {
        timer.remaining = 0;
        timerNotification(timer);
        timer.running = false;
      }
    }
  }

  lastCheck = now;
  updateWindows();
};

var updateWindows = function() {
  //iterate from the end in order to remove values
  for (var i = windows.length - 1; i >=0; i--) {
    if (windows[i].window === null) {
      windows.splice(i, 1);
    } else {
      windows[i].updateTimers();
    }
  }
};

var newTimer = function() {
  var timer = {
    running: false,
    length: 0,
    remaining: 0,
    title: 'New Timer'
  };

  timers.push(timer);

  return timer;
};

var deleteTimer = function(timer) {
  var idx = timers.indexOf(timer);
  timers.splice(idx, 1);
};

var timerNotification = function(timer) {
  var notification = webkitNotifications.createNotification(
    'calculator-128.png',
    timer.title,
    'Timer has completed!'
  );
  notification.show();
  $('#sound')[0].play();
};

var addWindow = function(win) {
  //check for duplicates
  if (windows.indexOf(win) === -1) {
    windows.push(win);
  }
};

var test = function() {
  console.log('test function');
  timers.push({
    running: false,
    length: 10000,
    remaining: 10000,
    title: 'test timer'
  });
};

setInterval(checkTimers, 1000);
