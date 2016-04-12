var express = require('express');
var app     = express();
var path    = require("path");

app.use(express.static('route'));

//possible routes
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname+'/homepage.html'));
});

app.get('/DRIVER/', function (req, res) {
  res.sendFile(path.join(__dirname+'/createString.html'));
  console.log(req.url);
});

app.get('/NAV/', function (req, res) {
  res.sendFile(path.join(__dirname+'/homepage.html'));
  console.log(req.url);
});

//var x = '+([A-Z])+([0-9])+([A-Z])+'

app.get('/DRIVER/:id', function (req, res) {
  console.log(req.params.id);
  console.log(req.url);
  res.sendFile(path.join(__dirname+'/driver.html'));
  //res.send({ driver: 1, nav: 0 });
});

app.get('/NAV/:id', function (req, res) {
  console.log(req.params.id);
  console.log(req.url);
  res.sendFile(path.join(__dirname+'/nav.html'));
});

// route to javascript
app.get('/function', function (req, res) {
  res.sendFile(path.join(__dirname+'/js/function2.js'));
  console.log(req.url);
});

// route to Bootstrap CSS
app.get('/css', function (req, res) {
  res.sendFile(path.join(__dirname+'/bootstrap-3.3.6-dist'));
  console.log(req.url);
});

// route to animation css
app.get('/animation', function (req, res) {
  res.sendFile(path.join(__dirname+'/animation.css'));
  console.log(req.url);
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
