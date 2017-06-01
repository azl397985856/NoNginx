var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');

var app = express();
app.use(session({
  genid: function(){
    return (new Date()).getTime();
  },
  resave: false,
  saveUninitialized: true,
  secret: 'api-mock-server'
}));

app.use(logger('dev'));
app.use(cookieParser());

app.use('/', function(req, res, next) {
  var path = req.path;
  var matched = path.match(/\.[html|js|css|jpg|jpeg|png]$/);
  if (matched) {
      // 静态请求，转发到webpack-dev-server
  } else {
      // 动态请求，转发到后台endpoints
  }

});

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
