var nunjucks = {
  currentCallback: 0,
  callbacks: {},

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
    var callbackNum = this.currentCallback;
    this.callbacks[callbackNum] = callback;
    this.currentCallback++;
    this.currentCallback %= 100;
    chrome.runtime.getBackgroundPage(function(background) {
      var iframe = background.document.getElementById('sandbox');
      iframe.contentWindow.postMessage({
        command: 'render',
        name: name,
        context: context,
        callback: callbackNum
      }, '*');
    });
  }
};

window.addEventListener('message', function(event) {
  if (event.data.command === 'rendered') {
    nunjucks.callbacks[event.data.callback](event.data.html);
    delete nunjucks.callbacks[event.data.callback];
  }
});
