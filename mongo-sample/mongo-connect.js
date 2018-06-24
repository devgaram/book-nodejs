/*
	node.js에서 mongodb-native 사용
	1. mongo-sample 폴더 생성
	2. npm init 을 통해 package.json 생성
	3. npm install mongodb을 통해 mongodb 모듈 설치

	**mongoDB 연결 기본 예제
*/

var Client = require('mongodb').MongoClient;

//사용할 데이터베이스의 이름은 blog이다.
var dbUrl = 'mongodb://localhost:27017/blog';	

//MongoClient 클래스의 connect 함수를 통해 데이터베이스의 서버에 접속한다.
Client.connect(dbUrl, function(error, database){
    if(error) {
        console.log(error);
        process.exit(1);
    } else {
    	console.info('connect완료 : ', database);
		database.close();
    }
});