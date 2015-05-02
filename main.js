var express = require('express');
var multer = require('multer')
var app = express();
app.use(multer({
	dest: './uploads/'
}))

var outputPath = 'result.txt';

var appId = 'Split App';
var password = 'oIGLZOt09upQa/x8O/mHIKU/';


var ocrsdkModule = require('./ocrsdk.js');
var ocrsdk = ocrsdkModule.create(appId, password);
ocrsdk.serverUrl = "http://cloud.ocrsdk.com"; 

function downloadCompleted(error) {
	if (error) {
		console.log("Error: " + error.message);
		return;
	}
	console.log("Done.");
}

function processingCompleted(error, taskData) {
	if (error) {
		console.log("Error: " + error.message);
		return;
	}

	if (taskData.status != 'Completed') {
		console.log("Error processing the task.");
		if (taskData.error) {
			console.log("Message: " + taskData.error);
		}
		return;
	}

	console.log("Processing completed.");
	console.log("Downloading result to " + outputPath);

	ocrsdk.downloadResult(taskData.resultUrl.toString(), outputPath, downloadCompleted);
}

function uploadCompleted(error, taskData) {
	if (error) {
		console.log("Error: " + error.message);
		return;
	}

	console.log("Upload completed.");
	console.log("Task id = " + taskData.id + ", status is " + taskData.status);
	if (!ocrsdk.isTaskActive(taskData)) {
		console.log("Unexpected task status " + taskData.status);
		return;
	}

	ocrsdk.waitForCompletion(taskData.id, processingCompleted);
}

var settings = new ocrsdkModule.ProcessingSettings();
settings.language = "English"; 
settings.exportFormat = "txt";



app.get('/', function(req, res) {
	res.send('Hello World!');
});

app.post('/api/photos', function(req, res) {
	console.dir(req.files);
	res.send('Upload complete');

	var imagePath = '/uploads/' + req.files.name;

	try {
		ocrsdk.processImage(imagePath, settings, uploadCompleted);

	} catch (err) {
		console.log("Error: " + err.message);
	}
});

var server = app.listen(3000, function() {

	var host = server.address().address;
	var port = server.address().port;

	console.log('Example app listening at http://%s:%s', host, port);

});




