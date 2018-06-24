/*
	**mongoDB 컬렉션 내 전체 다큐먼트 확인 
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
        //find메소드는 커서를 반환하는 데 toArray()를 적용하여 표준 자바스크립트 배열로 출력가능
    	//find({}).toArray() 컬렉션 내 전체 다큐먼트 array형태로 출력
       	db.collection('messages').find({}).toArray((error, item)=>{
            if(error){
                console.log(error);
                process.exit(1);
            }
            else{
                console.log('find:',item);
                database.close();
            }
        }) 
    }
});