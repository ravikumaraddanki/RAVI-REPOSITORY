var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

//new code
//call application insights
var appInsights = require('applicationinsights');
appInsights.setup('e93a0b8a-718a-4722-ac3e-bdf789dcb1cd');

appInsights.start();
//end
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);


//new code
app.use('/problem',function(){
  throw new error('somthing is wrong')
});
//end

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

//new code
  appInsights.defaultClient.trackException({exception:err});
  //end
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
