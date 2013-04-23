// Set up message event handler:
window.addEventListener('message', function(event) {
  var command = event.data.command;
  var name = event.data.name || 'hello';
  switch(command) {
  case 'render':
    dust.render(event.data.name, event.data.context, function(err, out) {
      event.source.postMessage({
        command: 'rendered',
        name: name,
        err: err,
        out: out
      }, event.origin);
    });
    break;
  case 'compile':
    dust.compileFn(event.data.source, event.data.name);
    //event.source.postMessage({name: name, success: true}, event.origin);
    break;
  }
});
