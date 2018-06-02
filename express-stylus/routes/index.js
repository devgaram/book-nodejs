var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  //쿼리문자열 미들웨어 다음에 실행.
  res.render('index', { title: 'Express' });
});

module.exports = router;
