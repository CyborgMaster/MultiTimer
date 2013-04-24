var formatTimer = function(millis) {
  var sec = Math.ceil(millis / 1000);
  var hours = Math.floor(sec / 3600);
  var minutes = Math.floor((sec - (hours * 3600)) / 60);
  var seconds = sec - (hours * 3600) - (minutes * 60);

  if (seconds < 10) { seconds = "0"+seconds; }
  if (hours > 0 && minutes < 10) { minutes = "0"+minutes; }
  var time = minutes+':'+seconds;
  if (hours > 0) { time = hours+':'+time; }
  return time;
};