
$(function () {
  // DEMOGAUGE1 - A very basic example...
  var meter = new jGauge('jGaugeDemo1'); // Create a new jGauge.
	meter.label.precision = 0; // 0 decimals (whole numbers).
	meter.label.suffix = ' t / i'; // Make the value label watts.
  meter.limitAction = limitAction.none;				
  meter.ticks.start = 0;
  meter.ticks.end = 150;
  meter.ticks.count = 7;

  meter.init();
  meter.setValue(75, meter.needle[0]);
  
  var socket = io.connect(),
      tweets = [];
      
  socket.on('tweet', function (tweet) {
    var now = Date.now(),
        before = now - (1000 * 5);
        inRange = false;
    tweets.push(now);
    
    for (var i = 0; !inRange; i++) {
      if (tweets[i] > before) {
        inRange = true;
        tweets = tweets.slice(i);
      }
    }
    
    meter.setValue(tweets.length, meter.needle[0]);
  });
});























