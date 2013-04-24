var templates = {};
var env = new nunjucks.Environment({});

env.addFilter('formatTimer', function(millis) {
  var sec = Math.ceil(millis / 1000);
  var hours = Math.floor(sec / 3600);
  var minutes = Math.floor((sec - (hours * 3600)) / 60);
  var seconds = sec - (hours * 3600) - (minutes * 60);

  if (seconds < 10) { seconds = "0"+seconds; }
  if (hours > 0 && minutes < 10) { minutes = "0"+minutes; }
  var time = minutes+':'+seconds;
  if (hours > 0) { time = hours+':'+time; }
  return time;
});

env.addFilter('remaining', function(start, length) {
  var remaining = start + length - +(new Date());
  return remaining >= 0 ? remaining : 0;
});

window.addEventListener('message', function(event) {
  var command = event.data.command;
  var name = event.data.name || 'hello';
  switch(command) {
  case 'render':
    event.source.postMessage({
      command: 'rendered',
      name: name,
      html: templates[event.data.name].render(event.data.context),
      callback: event.data.callback
    }, event.origin);
    break;
  case 'compile':
    templates[event.data.name] = new nunjucks.Template(event.data.source, env);
    //event.source.postMessage({name: name, success: true}, event.origin);
    break;
  }
});
