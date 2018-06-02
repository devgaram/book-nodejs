var express = require('express');
//var http = require('http'); express모듈 안에 포함되어있음.
var path = require('path');

var app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

/*
	라우터는 정의된 순서대로 처리되며, 보통 미들웨어 뒤에 위치하지만
	일부 미들웨어는 라우터의 뒤에 위치한다.(에러핸들러)
*/
app.all('*', (req, res)=> {
	/*
		res.render(viewName, data, callback(error, html)) 
		viewName : 파일 확장자가 있는 템플릿명 또는 뷰엔진이 설정된 경우 파일 확장자가 없는 템플릿 이름
		data : locals로 전달되는 객체
		callback : 렌더링이 끝났을 때 error 및 HTML과 함께 호출되는 함수(선택)

		* 이 함수는 Express.js의 메소드로 호출되었을 때는 res.end()를 호출한다. (res.end()는 응답 프로세스를 종료시킴)
		* res.render() 실행 다음에는 미들웨어들이 처리되지 않는다.
	*/
	res.render(
		'index', 
		{ msg: 'Welcome to the Practical node.js!'}
	);
})

app.listen(app.get('port'), function () {
  console.log('Example app listening on port' + app.get('port'));
});