var templates = {};
var env = new nunjucks.Environment({});

env.addFilter('formatTime', function(millis) {
  var sec = Math.floor(millis / 1000);
  var hours = Math.floor(sec / 3600);
  var minutes = Math.floor((sec - (hours * 3600)) / 60);
  var seconds = sec - (hours * 3600) - (minutes * 60);

  if (seconds < 10) { seconds = "0"+seconds; }
  if (hours > 0 && minutes < 10) { minutes = "0"+minutes; }
  var time = minutes+':'+seconds;
  if (hours > 0) { time = hours+':'+time; }
  return time;
});

window.addEventListener('message', function(event) {
  var command = event.data.command;
  var name = event.data.name || 'hello';
  switch(command) {
  case 'render':
    event.source.postMessage({
      command: 'rendered',
      name: name,
      html: templates[event.data.name].render(event.data.context)
    }, event.origin);
    break;
  case 'compile':
    templates[event.data.name] = new nunjucks.Template(event.data.source, env);
    //event.source.postMessage({name: name, success: true}, event.origin);
    break;
  }
});
