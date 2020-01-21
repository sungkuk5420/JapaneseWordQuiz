var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var cors = require('cors')

var routes = require('./routes/index');
//var routes = require('./routes/index2');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors())
 //uncomment after placing your favicon in /public

//import packages
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(__dirname + '/public/images/favicon.ico'));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;

app.get('/', function (req, res) {
  res.send('Hello World!');
});


//app.listen(3000, function () {
//  console.log('Example app listening on port 3000!');
//})

var port = 9000;
var httpServer =http.createServer(app).listen(port, function(req,res){
  console.log('Socket IO server has been started '+port+'!');
});
// upgrade http server to socket.io server
io = require('socket.io').listen(httpServer);

io.sockets.on('connection',function(socket){
  socket.emit('toclient',{msg:'Welcome !'});
  //socket.on('fromclient',function(data){
  //  socket.broadcast.emit('toclient',data); // 자신을 제외하고 다른 클라이언트에게 보냄
  //  socket.emit('toclient',data); // 해당 클라이언트에게만 보냄. 다른 클라이언트에 보낼려면?
  //  console.log('Message from client :'+data.msg);
  //})
});