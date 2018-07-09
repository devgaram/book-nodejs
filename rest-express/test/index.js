var superagent = require('superagent')
var expect = require('expect')

describe('express rest api server', function(){
	var id
	it('post object', function(done){
		superagent.post('http://localhost:3000/collections/test')
		.send({
			name: 'John',
			email: 'john@naver.com'
		})
		.end(function(e, res) {
			
			expect(e).toEqual(null)	//에러객체는 null이여야한다.
			expect(res.body.ops.length).toEqual(1) //응답 바디 배열은 한 가지 아이템만 가져야한다.
			expect(res.body.ops[0]._id.length).toEqual(24) //첫 응답 본문 아이템은 24길이의 문자형태인 _id를 가져야한다.
			id = res.body.ops[0]._id //새로 생성된 객체의 id를 전역변수에 저장해 조회, 변경, 삭제에 이용가능
			done()
		})
	})
	it('retrieves an object', function(done) {
		superagent.get('http://localhost:3000/collections/test/'+id)
		.end(function(e, res){
			expect(e).toEqual(null)
			expect(typeof res.body).toEqual('object')
			expect(res.body._id.length).toEqual(24)
			expect(res.body._id).toEqual(id)
			done() //done()콜백을 통해 비동기 코드 테스트 가능.
		})
	})
	it('retrieves a collection', function(done) {
		superagent.get('http://localhost:3000/collections/test')
		.end(function(e, res){
			expect(e).toEqual(null)
			expect(res.body.length).toBeGreaterThan(0)
			expect(res.body.map(function(item){ //map함수를 통해 응답결과로 id배열을 전달
				return item._id
			})).toContain(id) //contain메소드는 네이티브 indexof보다 나은 대안
			// 결과는 최대 10개의 레코드로 제한되고 최신 생성 순서로 정렬되어 id로 표시됨
			done()
		})
	})
	it('update an object', function(done) {
		superagent.put('http://localhost:3000/collections/test/'+id)
		.send({
			name: "Peter",
			email: "Peter@naver.com"
		})
		.end(function(e, res){
			expect(e).toEqual(null)
			expect(typeof res.body).toEqual('object')
			expect(res.body.msg).toEqual('success')
			done()
		})
	})
	it('checks an updated object', function(done){
		superagent.get('http://localhost:3000/collections/test/'+id)
		.end(function(e, res){
			expect(e).toEqual(null)
			expect(typeof res.body).toEqual('object')
			expect(res.body._id.length).toEqual(24)
			expect(res.body._id).toEqual(id)
			expect(res.body.name).toEqual('Peter')
			done()
		})
	})
	it('remove an object', function(done) {
		superagent.del('http://localhost:3000/collections/test/'+id)
		.end(function(e, res){
			expect(e).toEqual(null)
			expect(typeof res.body).toEqual('object')
			expect(res.body.msg).toEqual('success')
			done()
		})
	})
})