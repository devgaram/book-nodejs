exports.article = require('./article');
exports.user = require('./user');

/*
 * GET home page.
 */

/*
	model.find(query, [fields], [options],[callback(error, affectedCount, raw)])
*/
exports.index = function(req, res, next){
  req.models.Article.find({published: true}, null, {sort: {_id:-1}}, function(error, articles){
    if (error) return next(error);
    console.log(articles);
    res.render('index', { articles: articles});
  })
};
