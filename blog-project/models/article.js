var mongoose = require('mongoose');

/*
	스키마?
	도큐먼트의 프로퍼티(필드) 다입에 대한 정보를 가진 JSON 형태의 클래스
	스키마에 유효값과 기본값 특정 프로퍼티 여부에 관한 정보를 저장
	모델 생성에 필요하다.(스키마가 모델로 변환)
*/
var articleSchema = new mongoose.Schema({
	title : {
		type: String,
		required: true,
		validate: [
			function(value) {
				return value.length<=120
			},
			'Title is too long (120 max)'
		],
		default: 'New Post'
	},
	text: String,
	published: {
		type: Boolean,
		default: false	//기본값
	},
	slug: {
		type: String,
		set: function(value) {	//set 메소드 수행으로 공백문자 절대 포함 안함.
			return value.toLowerCase().replace(' ','-')
		}
	}
});

/*
	정적메소드, 특정한 도큐먼트 객체가 존재하지 않거나 필요가 없는 경우에 유용
	후크와 메스드는 스키마가 모델로 변환되기 전에 추가한다.!
	객체 모델 매소드 vs 정적 메소드
	인스턴스 객체에서 메소드를 호출하면 인스턴스 메소드가 되고
	book객체에서 호출한 경우가 정적메소드
	var Book = mongoose.model('Book', bookSchema)
	var practicalNodeBook = new Book({name: 'Practical noes.js'})
*/
articleSchema.static({
	list: function(callback) {
		this.find({},null, {sort:{_id:-1}}, callback);
	}
})

/*
	모델은 도큐먼트 생성(실제 데이터)에 사용된다.
	첫번째 파라미타는 이 모텔의 객체 생성 시 사용할 문자열.

*/
module.exports = mongoose.model('Article', articleSchema);