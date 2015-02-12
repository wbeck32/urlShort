var express = require('express');
var router = express.Router();
var app = require('../app');
var b62 = require('base62');
var n = require('nonce')();

/* GET home page. */
router.get('/', function(req, res, next) {
	var db = app.get('mongo');
  	res.render('index', { title: 'Express' });
});

router.post('/', function(request, response) {
	var db = app.get('mongo');
  var shortUrl = b62.encode(n());
  var timestamp = Date.now();
  //retrieve number of clicks, increment by one
  var numClicks = 2;

	var collection = db.collection('url_shorten');
  		collection.insert({ short : shortUrl, target : request.body.longURL, clicks : numClicks, lastClick : timestamp }, function(err, docs) {
          //response.redirect('/data/');
      response.redirect('/data/' + shortUrl);
  	});
});

router.get('/data/:shortUrl', function(request, response) {
//router.get('/data', function(request, response) {
  console.log(response.params);
	var db = app.get('mongo');
  	var collection = db.collection('url_shorten');
  	collection.find({ short : '' },{},function (e,docs){
  		docs.toArray(function (err,data){
  			console.log(data);
  			response.render('data', { "data" : data });
  		});
        
    });
    //shortUrl = request.params.shortUrl;
  	//collection.find({'shortened': shortUrl}, function(err, url) {
    //response.render('data', {url: url});
  //});
});

router.get('/:shortUrl', function(request, response) {
  //var collection = db.collection('urls'),
  //    shortUrl = request.params.shortUrl;
  //collection.find({'shortened': shortUrl}, function(err, url) {
  //  response.redirect(url.target);
  //});
});

module.exports = router;
