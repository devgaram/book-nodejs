var express = require('express'),
	mongoskin = require('mongoskin'),
	bodyParser = require('body-parser')

var app = express()
/* http 요청 시 필요한 파라미터와 데이터 추출하기위해 필요, 객체 파싱 역할*/
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())


var db = mongoskin.db('mongodb://@localhost:27017/test',{safe:true})
var id = mongoskin.helper.toObjectID	//16진수 문자열을 MONGODB ObjectID 데이터 타입으로 변환하는 헬퍼함수

/*express 미들웨어 메소드 중 하나로 요청핸들러에서 등록한 url 패턴이 들어오면 매번 실행됨
collectionName을 접두어로 하는 요청 패턴이 들어올경우 특정 컬렉션을 선택하는 메소드*/
app.param('collectionName', function(req, res, next, collectionName) {
	req.collection = db.collection(collectionName)
	return next()
})

app.get('/', function(req, res, next){
	res.send('select a collection, e.g, /collections/messages')
})

app.get('/collections/:collectionName', function(req, res, next){
	req.collection.find({},{
		limit:10, sort:[['_id',-1]]
	}).toArray(function(e, results){
		if(e) return next(e)
		res.send(results)
	})
})

app.post('/collections/:collectionName', function(req, res, next){
	req.collection.insert(req.body, {}, function(e, results){
		if(e) return next(e)
		res.send(results)
	})
})

app.get('/collections/:collectionName/:id', function(req, res, next){
	req.collection.findOne({
		_id: id(req.params.id)
	}, function(e, result){
		if(e) return next(e)
		res.send(result)
	})
})

app.put('/collections/:collectionName/:id', function(req, res, next){
	
	req.collection.update({
		_id: id(req.params.id)
	},
	{$set:req.body}, //값 설정을 위한 특별한 mongoDB 연산자 
	{safe:true, multi:false},	//콜백함수 실행 전 다중처리가능 여부알려줌
	function(e, result){
		if(e) return next(e)
		console.log(result.result.ok)
		res.send((result.result.ok === 1) ? {msg:'success'} : {msg:'error'})
	})
})

app.delete('/collections/:collectionName/:id', function(req, res, next){
	req.collection.remove({
		_id: id(req.params.id)
	}, function(e, result){
		if(e) return next(e)
		res.send((result.result.ok ===1) ? {msg:'success'} : {msg:'error'})
	})
})

app.listen(3000, function(){
	console.log('sever is running...')
})