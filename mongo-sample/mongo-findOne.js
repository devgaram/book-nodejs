/*
	**mongoDB 컬렉션 내 특정 다큐먼트 확인 
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
    	var db = database.db('blog');
    	//findOne({index:value}) 찾을 다큐먼트
       	db.collection('messages').findOne({name:'garami'}, (error, item)=>{
    		if (error){
    			console.error(error);
    			process.exit(1);
    		}
    		else{
    			console.log('findOne:', item);
    			database.close();
    		}
    	})    
    }
});