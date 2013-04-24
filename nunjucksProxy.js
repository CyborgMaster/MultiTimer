var nunjucks = {
  //TODO callback buffer
  currentCallback: null,

  compile: function(name, source) {
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
    if (nunjucks.currentCallback != null) {
      console.error("nunjucks callback already occupied!!!");
    }
    nunjucks.currentCallback = callback;
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
    if (typeof(nunjucks.currentCallback) === 'function') {
      nunjucks.currentCallback(event.data.html);
      nunjucks.currentCallback = null;
    }
  }
});
