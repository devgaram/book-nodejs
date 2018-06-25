var boot = require('../app').boot,
	shutdown = require('../app').shutdown,
	port = require('../app').port,
	superagent = require('superagent'),
	expect = require('expect.js');

	var seedArticles = require('../db/articles.json');

describe('server', ()=>{
	before(()=>{
		boot();
	});
	describe('homepage', ()=>{
		it('should respond to GET', (done)=>{
			superagent
				.get('http://localhost:'+port)
				.end((err,res)=>{
					expect(res.status).to.equal(200);
					done();
				});
		});
		it('should contain ports', (done)=>{
			superagent
				.get('http://localhost:'+port)
				.end((err,res)=>{	//request 요청이 보내질 때 실행됨.
					seedArticles.forEach((item, index, list)=>{
						if(item.published) {
							expect(res.text).to.contain('<h2><a href="/articles/' + item.slug + '">' + item.title);
						} else{
							expect(res.text).not.to.contain('<h2><a href="/articles/' + item.slug + '">' + item.title);
						}
						console.log(item.title, res.text);
					})
					done();
				});
		})
	});
	describe('article page', ()=>{
		it('should display text', (done)=>{
			var n = seedArticles.length;
			seedArticles.forEach((item, index, list)=>{
				superagent
					.get('http://localhost:'+port+'/articles/'+seedArticles[index].slug)
					.end((err,res)=>{
						if(item.published) {
							expect(res.text).to.contain(seedArticles[index].text);
						} else{
							expect(res.status).to.be(401);
						}
						//console.log(item.title)
						// superagent의 response 콜백 호출 전 mocha 종료 방지를 위해
						if(index + 1 === n) {
							done();
						}
					})
			})
		})
	})
	after(()=>{
		shutdown();
	})
});

