var express = require('express');
var multer = require('multer')
var app = express();

var server = require('http').Server(app);
var io = require('socket.io')(server);

var tesseract = require('node-tesseract');

var nexmo = require('easynexmo');
var request = require('request');

var bodyParser = require('body-parser');

nexmo.initialize('0b3f7f9c', '6ea51cfd', 'http', 'true');

app.set('view engine', 'ejs');

app.use(multer({
	dest: './uploads/'
}))


app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
	extended: true
}));

app.get('/', function(req, res) {
	res.send('Hello World!');
});

app.post('/api/photos', function(req, res) { //req must have venmo access token  and user id
	console.dir(req.files);
	res.send('Upload complete');

	var imagePath = '/uploads/' + req.files.files.name;
	console.log(imagePath);

	tesseract.process(__dirname + imagePath, function(err, text) {
		if (err) {
			console.error(err);
		} 

		else {
			var str = text.match(/(\d+\.\d+)\s/g);
			var amount = parseFloat(str[0].substring(0, str[0].length - 1));

			console.log(amount);
			request.post('https://api.venmo.com/v1/payments', { 
				form: {
					access_token: 'ac0bf130d8f00a7e90ca73c3021469f6182dd6ecf24c1b81c865421f695ea26c',
					user_id: 'casidoo',
					note: 'Thanks for using Split™',
					amount: amount
				}
			});

		}
	});
});

app.post('/upload', function(req, res) { 
	console.dir(req.files);
	res.send('Upload complete');

});


app.get('/showmethemoney', function(req, res) {
	console.log("Hello World");
	res.render('index');
});

app.get('/nexmo', function(req, res) {
	var tel = req.param('tel');
	var msg = req.param('msg');
	//nexmo.sendTextMessage('12532715412','14255912367','Helllo I love Nexmo!', '', console.log('Nexmo sent!'));	
	nexmo.sendTextMessage('12532715412', tel, msg, '', console.log('Nexmo sent!'));
	console.log("Nexmo sent!!");
	res.send('Nexmo');
});

// user act as a receiver
// user act as a master

//flicks, notify all people 
// charges everyone

var friends = [];

io.on('connection', function(socket) {

	socket.on('master', function(data) {
		console.log(data.username);
		socket.emit('master', {
			username: data.username
		});
	});

	socket.on('flicked', function(data) { // data  = {venmoID: id}
		socket.emit('flicked-response', {
			username: data.username
		});
	});

	socket.on('login', function(data){
		friends.push(data.username);
		console.log(data.username);
		socket.emit('login-confirm', {
			friends: friends
		});
	});

	socket.on('update-friends', function(data){
		socket.emit('new-friends', {
			friends: friends
		});
	});
});


server.listen(3000);
