var express = require('express');
var multer  = require('multer')
var app = express();
app.use(multer({ dest: './uploads/'}))

var port = process.ENV

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.post('/api/photos', function(req, res) {
  console.dir(req.files);
});

var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});