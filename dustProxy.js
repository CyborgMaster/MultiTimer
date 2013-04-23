var dust = {
  //TODO callback buffer
  currentCallback: null,

  compileFn: function(source, name) {
    chrome.runtime.getBackgroundPage(function(background) {
      var iframe = background.document.getElementById('sandbox');
      iframe.contentWindow.postMessage({
        command: 'compile',
        source: source,
        name: name
      }, '*');
    });
  },

  render: function(name, context, callback) {
    if (dust.currentCallback != null) {
      console.error("dust callback already occupied!!!");
    }
    dust.currentCallback = callback;
    chrome.runtime.getBackgroundPage(function(background) {
      var iframe = background.document.getElementById('sandbox');
      iframe.contentWindow.postMessage({
        command: 'render',
        name: name,
        context: context
      }, '*');
    });
  }
};

window.addEventListener('message', function(event) {
  if (event.data.command === 'rendered') {
    if (typeof(dust.currentCallback) === 'function') {
      dust.currentCallback(event.data.err, event.data.out);
      dust.currentCallback = null;
    }
  }
});
