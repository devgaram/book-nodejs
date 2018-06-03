var pug = require('pug'),
	fs = require('fs');

var data = {
	title : "Practical Node.js",
	author: {
		twitter: "@garam",
		name: "LGR"
	},
	tags: ['express', 'node', 'javascript']
}

data.body = process.argv[2];

fs.readFile('pug-example.pug', 'utf-8', (error, source)=>{
	var template = pug.compile(source);
	var html = template(data);
	console.log(html);
})

fs.readFile('pug-example.pug', 'utf-8', (error, source)=>{
	var html = pug.render(source, data);
	console.log(html);
})

pug.renderFile('pug-example.pug', data, (error, html)=>{
	console.log(html);
})