var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var stylus = require('stylus');
/*
	미들웨어에는 유용한 동작을 하거나 요청이 실행되는 데 도움이 되는 	무언가를 추가하는 패스스루 함수가 있다.
	예) 	body-parser, cookie-parser는 http 요청에 req.body와 파싱된 쿠키 데이터(req.cookie)를 추가한다.
*/

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
//__dirname - C:\Users\USER\Desktop\개인공부\book-nodejs\express-stylus
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));	// 터미널에 요청에 대한 로그를 끊임없이 출력
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(stylus.middleware(path.join(__dirname, 'public')));
/*
	정적파일제공
	/stylesheets/style.css (O)
	/public/stylesheets/style.css (X)
*/
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  /*
	next() 호출 시, express는 현재 오류가 있는것으로 간주하여 오류 처리와 관련되지 않은 나머지 라우팅 및 미들웨어를 건너뛴다.
	(route 매개변수의 경우 제외)
  */
  next(createError(404));
});

// error handler
// production 에러 핸들러
// 사용자에게 stacktrace가 출력되지 않는다.
// 오류처리함수는 4개의 인수를 가진다.
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
