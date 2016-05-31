/*global module,require*/
var express = require('express');
var router = express.Router();
var request = require('superagent');
var _ = require('underscore');
var fs = require('fs');
var routerObj = {};

var url = "";
var jsession="";
router.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");  
  res.header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"); 
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("X-Powered-By",' 3.2.1');
  next();
});
router.get('', function (req, res) {
  console.log('rendering index page now');
  res.render('index', {
    title: 'luzhipeng',
  });
}).all('/write', function(req, res) {
  url = req.param('url');
  console.log('url:', req.param('url'));
  res.end();
}).all('*', function (req, res) {
    //send request to assigned address
    var superagent = require('superagent');
    console.log(url + req.path);
    // 查询本机ip,这里需要根据实际情况选择get还是post
    console.log("getQuert",getQuert(req.query));
    req.method.toLowerCase() === 'get' ? reqPath = url + req.path + getQuert(req.query) : reqPath = url + req.path;
    jsession !== "" ? req.header['set-cookie'] = jsession : '';
    var sreq = superagent[req.method.toLowerCase()](reqPath)
    .set('Cookie', jsession)
    .set('Accept', 'application/json, text/javascript, */*; q=0.01')
    .set('Content-Type', 'application/json; charset=utf-8')
    .send(_.extend(req.body,req.query)).end(function (err, data) {
    if (err) {
      res.status(500).json(err);
    } else {
      // console.log('res:', data.body);
      // res.json(data.header['set-cookie'].toString().split(';')[0]);
      if (data.header['set-cookie']) {
           jsession = data.header['set-cookie'].toString().split(';')[0];
      }
      res.header("Content-Type", "application/json; charset=utf-8");
      res.json(data.body);
    }
  });
});
function getQuert(query) {
  var ret = '?';
  for (var key in query) {
      if (Object.prototype.hasOwnProperty.call(query, key)) {
        ret = ret + key + '=' + query[key] + '&';
      }
    }
    return ret.substring(0, ret.length - 1);
};
module.exports = router;
