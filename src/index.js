//I did not create the following open source software:
//node.js
//express
//neDB
//bodyParser

//These pieces of software can be found at:
//npmjs.com
//nodejs.com

//I give full credit to every instance of these pieces of software in my code to those
//who developed and managed them

//I merely extended on these projects in this code

var express = require('express');
const Datastore = require('nedb');
var bodyParser = require('body-parser');

var app = express();

app.listen(3000, () => console.log('listening'));

const database = new Datastore('database.db');
database.loadDatabase();


app.use(express.static('public'));
app.use(express.json({limit: '2mb'}));
app.use(bodyParser.text());
const datab = [];

app.post("/dataTransfer", (req, res)=> {
	console.log("request");
	const data = req.body;
	database.insert(data);
});

app.get('/dataGet', (req, res)=> {
	database.find({}, function(err, data){
		if (err) {
			console.log('error');
			res.end();
			return;
		}
		res.json(data);
		console.log(data);
	});
});

app.post('/update', (req, res) =>{
	id = req.body;
	console.log(id);
	database.update({ btn: id }, { $set: { complete: "true" } }, { multi: true }, function (err, numReplaced) {
	});
})


