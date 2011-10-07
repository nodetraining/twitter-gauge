var static = require('node-static'),
    http = require('http'),
    fs = require('fs'),
    path = require('path'),
    twitterNode = require('twitter-node'),
    sio = require('socket.io');

var steveMeter = module.exports;

steveMeter.createServer = function (options) {
  options = options || {};
  options.port = options.port || 8000;
  
  //
  // Create a node-static server instance to serve the './public' folder
  //
  var file = new(static.Server)('./public'),
      server;

  server = http.createServer(function (request, response) {
    request.addListener('end', function () {
      //
      // Serve files!
      //
      file.serve(request, response);
    });
  })
  
  var io = sio.listen(server);
  options.listener = function (tweet) {
    io.sockets.emit('tweet', tweet.text);
  };
  
  steveMeter.startTwitter(options);

  if (options.port) {
    server.listen(options.port);
  }
  
  return server;
};

steveMeter.load = function (file) {
  var root = path.join(__dirname, '..'),
      config = JSON.parse(fs.readFileSync(path.join(root, 'config.json'), 'utf8'));
  
  config.track = JSON.parse(fs.readFileSync(path.join(root, file))).track;
  return config;
};

steveMeter.startTwitter = function (options) {
  var config = steveMeter.load(options.file),
      twitterStream;
      
  twitterStream = new twitterNode.TwitterNode({
    user: config.user,
    password: config.password,
    track: config.track
  });

  twitterStream.on('tweet', options.listener);
  twitterStream.stream();
};