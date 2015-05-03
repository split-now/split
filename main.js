var express = require('express');
var multer = require('multer')
var app = express();

var server = require('http').Server(app);
var io = require('socket.io')(server);

var tesseract = require('node-tesseract');


app.use(multer({
	dest: './uploads/'
}))


app.get('/', function(req, res) {
	res.send('Hello World!');
});

app.post('/api/photos', function(req, res) {
	console.dir(req.files);
	res.send('Upload complete');

	var imagePath = '/uploads/' + req.files.files.name;
	console.log(imagePath);

	tesseract.process(__dirname + imagePath, function(err, text) {
		if (err) {
			console.error(err);
		} else {
			var str = text.match(/(\d+\.\d+)\s/g);

			console.log(parseFloat(str[0].substring(0, str[0].length - 1)) + 0.01);
		}
	});
});

app.get('/showmethemoney', function(req, res) {
	console.log("Hello World");
});
// user act as a receiver
// user act as a master

//flicks, notify all people 
// charges everyone

io.on('connection', function(socket) {

	socket.on('master', function(data) {
		socket.emit('master', {
			masterID: data.venmoID
		});
	});

	socket.on('flicked', function(data) { // data  = {venmoID: id}
		socket.emit('flicked-response', {
			masterID: data.venmoID
		});
	});


});


server.listen(3000);
