var express = require('express');
var multer = require('multer')
var app = express();

var ocrs = require('./ocrs.js');

app.use(multer({
	dest: './uploads/'
}))



app.get('/', function(req, res) {
	res.send('Hello World!');
});

app.post('/api/photos', function(req, res) {
	console.dir(req.files);
	res.send('Upload complete');

	var imagePath = './uploads/' + req.files.files.name;
	console.log(imagePath);
	try {
		ocrsdk.processImage(imagePath, settings, uploadCompleted);

	} catch (err) {
		console.log("Error: " + err.message);
	}
});

app.get('/showmethemoney', function(req, res){
	console.log("Hello World");	
	});


var server = app.listen(3000, function() {

	var host = server.address().address;
	var port = server.address().port;

	console.log('Example app listening at http://%s:%s', host, port);

});


