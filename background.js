chrome.app.runtime.onLaunched.addListener(function() {
  window.open('window.html');
  // chrome.app.window.create('window.html', {
  //   'width': 400,
  //   'height': 500
  // });
});