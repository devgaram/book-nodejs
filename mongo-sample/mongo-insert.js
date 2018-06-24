/*
	**mongoDB insert 예제
*/

var Client = require('mongodb').MongoClient;
var dbUrl = 'mongodb://localhost:27017/blog';	

Client.connect(dbUrl, function(error, database){
    if(error) {
        console.log(error);
        process.exit(1);
    } else {
    	// blog서버의 messages 컬렉션에 도큐먼트 생성 후 도큐먼트와 객체 출력
    	// database.collection() 은 에러발생. collection() is not function
    	var db = database.db('blog');
    	var item = {
    		name : 'garami'
    	}

    	db.collection('messages').insert(item, (error, item)=>{
    		if (error){
    			console.error(error);
    			process.exit(1);
    		}
    		else{
    			console.log('inserted:', item);
    			database.close();
    		}
    	})    
    }
});