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

var users = [{
	username: 'timotius',
	phone: '13472608289',
	name: 'Timotius Sitorus'
}, {
	username: 'demianborba',
	phone: '14154703689',
	name: 'Demian Borba'
}, {
	username: 'cassidoo',
	phone: '16302023624',
	name: 'Cassidy Williams'
}, {
	username: 'ijoosong',
	phone: '12153173289',
	name: 'Joseph Song'
}, {
	username: 'Justin-woo-1',
	phone: '14255912367',
	name: 'Justin Woo'
}]

var friends = [];

var charges = [];

app.set('view engine', 'ejs');

app.use(multer({
	dest: './uploads/'
}))


app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
	extended: true
}));

// request.post('https://api.venmo.com/v1/oauth/access_token', { 
var formData = {
		client_id: '2595',
		code: 'casidoo',
		client_secret: '23BB5tf8ajMhdEEtASz65r9QpYqySfnx',
	}
	// });
var access_token;
// request.post({url:'https://api.venmo.com/v1/oauth/access_token', formData: formData}, function (err, httpResponse, body) {
//   if (err) {
//     return console.error('upload failed:', err);
//   }
//   console.log('Upload successful!  Server responded with:', body);
//   access_token = body.access_token;
// });

app.get('/', function(req, res) {
	res.send('Hello World!');
});

app.post('/api/photos', function(req, res) { //req must have username 
	console.dir(req.files);
	res.send('Upload complete');

	var imagePath = '/uploads/' + req.files.files.name;
	console.log(imagePath);

	tesseract.process(__dirname + imagePath, function(err, text) {
		if (err) {
			console.error(err);
		} else {
			var str = text.match(/(\d+\.\d+)\s/g);
			var amount = parseFloat(str[0].substring(0, str[0].length - 1));

			console.log(amount);

			for (var i = 0; i < charges.length; i++) {
				if (charges[i].username === req.body.username)
					charges.amount += amount;
			}
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

<<<<<<< HEAD
// app.get('/charge', function(req, res) {
// 	for (var i = 0; i < users.length; i++) {
// 		if (req.body.username === )
// 	}
// 	nexmo.sendTextMessage('12532715412', phone, 'Hi ' + req.body.username + ', your Venmo account has been charged $' + amount, '', console.log('Hi Tim, Your Venmo account has been charged $15'));
// 	// nexmo.sendTextMessage('12532715412', '13472608289', 'Hi Tim, your Venmo account has been charged $15', '', console.log('Hi Tim, Your Venmo account has been charged $15'));
// 	// nexmo.sendTextMessage('12532715412', '13472608289', 'Hi Tim, your Venmo account has been charged $15', '', console.log('Hi Tim, Your Venmo account has been charged $15'));
// 	// nexmo.sendTextMessage('12532715412', '13472608289', 'Hi Tim, your Venmo account has been charged $15', '', console.log('Hi Tim, Your Venmo account has been charged $15'));
// });
=======
app.get('/charge', function(req, res){
	nexmo.sendTextMessage('12532715412', '13472608289', 'Hi Tim, your Venmo account has been charged $15', '', console.log('Hi Tim, Your Venmo account has been charged $15'));
	nexmo.sendTextMessage('12532715412', '12153173289', 'Hi Joe, your Venmo account has been charged $15', '', console.log('Hi Tim, Your Venmo account has been charged $15'));
	nexmo.sendTextMessage('12532715412', '14154703689', 'Hi Demian, your Venmo account has been charged $15', '', console.log('Hi Tim, Your Venmo account has been charged $15'));
	nexmo.sendTextMessage('12532715412', '14255912367', 'Hi Justin, your Venmo account has been charged $15', '', console.log('Hi Tim, Your Venmo account has been charged $15'));
	nexmo.sendTextMessage('12532715412', '16302023624', 'Hi Cassidy, your Venmo account has been charged $15', '', console.log('Hi Tim, Your Venmo account has been charged $15'));
});
>>>>>>> 62e9b0f9cdb585391eac7f88d50830494e6806a6


// user act as a receiver
// user act as a master

//flicks, notify all people 
// charges everyone
<<<<<<< HEAD
=======
var users = [{
	username: 'timotius',
	phone: '13472608289',
	name: 'Timotius Sitorus'
}, {
	username: 'demianborba',
	phone: '14154703689',
	name: 'Demian Borba'
}, {
	username: 'cassidoo',
	phone: '16302023624',
	name: 'Cassidy Williams'
}, {
	username: 'ijoosong',
	phone: '12153173289',
	name: 'Joseph Song'
}, {
	username: 'jw',
	phone: '14255912367',
	name: 'Justin Woo'
}]
>>>>>>> 62e9b0f9cdb585391eac7f88d50830494e6806a6


io.on('connection', function(socket) {



	socket.on('master', function(data) {
		console.log("master: " + data.username);
		io.sockets.emit('master', {
			username: data.username
		});
	});

	socket.on('charge', function(data) { // data  = {}
		var data = charges[i];
		for (var i = 0; i < charges.length; i++) {
			nexmo.sendTextMessage('12532715412', data.phone, 'Hi ' + data.username + ', your Venmo account has been charged $' + amount, '', console.log('Hi ' + data.username + ', Your Venmo account has been charged $15'));
		}

	});

	// socket.on('flick', function(data) {
	// 	var addData = function(username, phone) {
	// 		charges.push({
	// 			username: username,
	// 			phone: phone,
	// 			amount: 0

	// 		});

	// 	}

	// 	for (var i = 0; i < users.length; i++) {
	// 		if (users[i].username === data.username) {
	// 			var phone = users[i].phone;
	// 			addData(data.username, phone);
	// 		}
	// 	}

	// });

	socket.on('flicked', function(data){
		var phone;
		for (var i = 0; i < users.length; i++) {
			if (users[i].username === data.username) {
				phone = users[i].phone;
			}
		}
		nexmo.sendTextMessage('12532715412', phone, 'Hi ' + data.username + ', your Venmo account has been charged.', '', console.log('Hi, Your Venmo account has been charged'));
	});

	socket.on('ice tea', function(data){
		io.sockets.emit('item', {
			username: 'cassidoo',
			amount: '3.99'
		});

		nexmo.sendTextMessage('12532715412', '16302023624', 'Hi Cassidy, your Venmo account has been charged $3.99.', '', console.log('Hi, Your Venmo account has been charged'));
	});

	socket.on('calamari', function(data){
		io.sockets.emit('item',{
			username: 'jw',
			amount: '10.79'
		});

		nexmo.sendTextMessage('12532715412', '14255912367', 'Hi Justin, your Venmo account has been charged $10.79.', '', console.log('Hi, Your Venmo account has been charged'));
	})


	socket.on('login', function(data) {
		var success = function() {
			console.log(data.username);
			console.log(friends[friends.length - 1].phone);
			console.log(friends[friends.length - 1].name);

			io.sockets.emit('new-friends', {
				friends: friends
			});
		}

		for (var i = 0; i < users.length; i++) {
			if (users[i].username === data.username) {
				friends.push(users[i]);
				success();
			}

			if (i == users.length)
				console.log("invalid username");
		}

	});



	socket.on('logout', function(data) {
		for (var i = 0; i < friends.length; i++) {
			if (friends[i].username === data.username) {
				friends = friends.splice(i, 1);
				break;
			}
		}
	})
});


server.listen(3000);
