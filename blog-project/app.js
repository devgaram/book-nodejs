/*
	app.js 
	프로젝트 시작점
*/
var express = require('express'),
	path = require('path'),
	routes = require('./routes'),
	mongoose = require('mongoose'),
	models = require('./models'),
	bodyParser = require('body-parser'),
	dbUrl = process.env.MONGOHQ_URL || 'mongodb://@localhost:27017/blog',
	db = mongoose.connect(dbUrl, {safe: true});	
	/*
		몽구스 요청은 버퍼링을 지원하므로 연결 수립이 완료되기까지 대기할 필요가 없다.
		네이티브 드라이브는 보통 콜백을 필요로함.
	*/


var errorhandler = require('errorhandler');
//var http = require('http'); express모듈 안에 포함되어있음.
var server;
var app = express();	//express.js 객체 생성
app.locals.appTitle = 'blog-express';	//타이틀 설정

// req 객체를 통한 개별 express.js 경로 내의 mongoskin과 mongodb 컬렉션을 노출하는 미들웨어 추가
app.use((req, res, next)=>{
	if(!models.Article || !models.User ) return next(new Error('no models'))
	req.models=models;
	return next();	//** 이 미들웨어 안에서 next() 호출 안하면 각 요청이 정지상태에 빠진다.
})
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

if ('development' == app.get('env')) {
	app.use(errorhandler())
}


app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.locals.pretty= true;

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());


app.get('/', routes.index);
app.get('/login', routes.user.login);
app.post('/login', routes.user.authenticate);
app.get('/logout', routes.user.logout);
app.get('/admin',  routes.article.admin);
app.get('/post',  routes.article.post);
app.post('/post', routes.article.postArticle);
app.get('/articles/:slug', routes.article.show);

/*
	라우터는 정의된 순서대로 처리되며, 보통 미들웨어 뒤에 위치하지만
	일부 미들웨어는 라우터의 뒤에 위치한다.(에러핸들러)
*/
//app.get('*', (req, res)=> {
	/*
		res.render(viewName, data, callback(error, html)) 
		viewName : 파일 확장자가 있는 템플릿명 또는 뷰엔진이 설정된 경우 파일 확장자가 없는 템플릿 이름
		data : locals로 전달되는 객체
		callback : 렌더링이 끝났을 때 error 및 HTML과 함께 호출되는 함수(선택)

		* 이 함수는 Express.js의 메소드로 호출되었을 때는 res.end()를 호출한다. (res.end()는 응답 프로세스를 종료시킴)
		* res.render() 실행 다음에는 미들웨어들이 처리되지 않는다.
	*/
//	res.render(
//		'index', 
//		{ 
//			msg: '나는 로컬데이터입니다.'
//		}
//	);
//})

// REST API routes
/*
	대부분 ajax 브라우저 자바스크립트에서 필요로 하는 관리자용 페이지이다.
	GET, POST, PUT, DELETE 메소드를 사용하며, PUG 템플릿에서 HTML을 렌더링하지 않고 JSON 형태로 출력한다.
*/
app.get('/api/articles', routes.article.list);
app.post('/api/articles', routes.article.add);
app.put('/api/articles/:id', routes.article.edit);
app.delete('/api/articles/:id', routes.article.del);

/*
 사용자가 잘못된 URL로 응답을 요청할 경우를 대비해 404 응답처리
*/
app.all('*', function(req, res) {
  res.sendStatus(404);
})


var boot = ()=>{
	server = app.listen(app.get('port'), function () {
  		console.log('Example app listening on port' + app.get('port'));
	});
}

var shutdown = ()=>{
	server.close();
}

if (require.main === module){
	boot();
}
else{
	console.info('Running app as module')
	exports.boot = boot;
	exports.shutdown = shutdown;
	exports.port = app.get('port');
}
