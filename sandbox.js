var templates = {};
var env = new nunjucks.Environment({});

env.addFilter('formatTimer', function(millis) {
  return formatTimer(millis);
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
