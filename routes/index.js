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
  var numClicks = 0;
	var collection = db.collection('url_shorten');
      collection.insert({ short : shortUrl, target : request.body.longURL, clicks : numClicks, lastClick : timestamp }, function(err, docs) {
      response.redirect('/data/' + shortUrl);
  	});
});

router.get('/data/:shortUrl', function(request, response) {
	var db = app.get('mongo');
	var collection = db.collection('url_shorten');
  var su = request.params.shortUrl;
	
  collection.findOne({ short : su },{},function (e,docs){
    docs.clicks = docs.clicks++;
    
    collection.update({ short: su },{ $set: {clicks:docs.clicks}}, function (e, data){
     
      collection.findOne({ short : su }, {},function (e, update){

        collection.findOne({ _id : update._id }, {},function (e, mmm){
          response.render('data', { "data" : mmm });
        });       
      });
    }); 
  });
});
 

router.get('/:shortUrl', function(request, response) {
  var db = app.get('mongo');
  var collection = db.collection('url_shorten');
    shortUrl = request.params.shortUrl;
    collection.findOne({short : shortUrl},{}, function(err, url) {
      if (url){response.redirect(url.target);}
  });
});

module.exports = router;
