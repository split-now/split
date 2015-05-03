var express = require('express');
var multer = require('multer')
var app = express();
var ocrs = require('./ocrs.js');
var nexmo = require('easynexmo');

nexmo.initialize('0b3f7f9c','6ea51cfd','http','true');

app.set('view engine', 'ejs');

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
	res.render('index');
});

app.get('/nexmo', function(req, res){
	var tel = req.param('tel');
	var msg = req.param('msg');
 	//nexmo.sendTextMessage('12532715412','14255912367','Helllo I love Nexmo!', '', console.log('Nexmo sent!'));	
 	nexmo.sendTextMessage('12532715412', tel, msg, '', console.log('Nexmo sent!'));	
	console.log("Nexmo sent!!");	
	res.send('Nexmo');
});


var server = app.listen(3000, function() {

	var host = server.address().address;
	var port = server.address().port;

	console.log('Example app listening at http://%s:%s', host, port);

});


