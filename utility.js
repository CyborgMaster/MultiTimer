var formatTimer = function(millis) {
  var sec = Math.ceil(millis / 1000),
      hours = Math.floor(sec / 3600),
      minutes = Math.floor((sec - (hours * 3600)) / 60),
      seconds = sec - (hours * 3600) - (minutes * 60);

  if (seconds < 10) { seconds = "0"+seconds; }
  if (hours > 0 && minutes < 10) { minutes = "0"+minutes; }
  var time = minutes+':'+seconds;
  if (hours > 0) { time = hours+':'+time; }
  return time;
};

var parseTimer = function(str) {
  var vals = str.trim().split(':'),
      len = vals.length,
      sec = parseInt(vals[len - 1]),
      min = len <= 1 ? 0 : parseInt(vals[len - 2]),
      hours = len <= 2 ? 0 : parseInt(vals[len - 3]);

  return sec * 1000 + min * 1000 * 60 + hours * 1000 * 60 * 60;
};