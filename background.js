var timers = [];

chrome.app.runtime.onLaunched.addListener(function() {
  window.open('window.html');
});
chrome.runtime.onSuspend.addListener(function() {
  console.log('Suspended!!!');
});

var checkTimers = function() {
  var timerNum, timer, now = +(new Date()), i;

  for (i = 0; i < timers.length; i++) {
    timer = timers[i];
    if (timer.running && now > timer.start + timer.length) {
      timerNotification(timer);
      timer.running = false;
    }
  }
};

var test = function() {
  console.log('test function');
  timers.push({
    running: false,
    start: +(new Date()),
    length: 2000,
    title: 'test timer'
  });
};


var timerNotification = function(timer) {
  var notification = webkitNotifications.createNotification(
    'calculator-128.png',
    'Timer!',
    timer.title
  );
  notification.show();
  $('#sound')[0].play();
};

setInterval(checkTimers, 1000);
