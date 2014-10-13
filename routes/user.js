
/*
 * GET users listing.
 */
var express = require('express');
var router = express.Router();
var mysql = require('mysql');

exports.list = function(req, res){
  res.send("respond with a resource");
};


function connect()
{
	var connection = mysql.createConnection({
		host     : 'test1.cgcitoidtcqx.us-east-1.rds.amazonaws.com',
		user     : 'root',
		password : 'password',
		port: '3306',
		database: 'test1'
	});

	connection.connect();

	return connection;
}

exports.createUser = function createUser(firstName,lastName,email,password,logintime)
{
	var query = "INSERT INTO users VALUES('" + firstName + "','" +lastName + "','" + email + "','" + password + "','" + logintime + "')";
	console.log("query running is " + query);
	connect().query(query,function(err,results) {
		if (err) {
			console.log("ERROR: " + err.message);
		}
		console.log(results);
	});
};

function validateUser(callback,email,password)
{
	var query = "SELECT * from users where email='" + email +  "'AND password='" + password + "'";
	connect().query(query,function(err,rows,fields){
		if (err) {
			console.log("ERROR: " + err.message);
		}
		else
		{
			if(rows.length!==0)
			{
				console.log("DATA : "+JSON.stringify(rows));
				callback(err, rows);
			}
			else
			{
				callback("Invalid Username", rows);
			}
		}

	});
}

exports.products = function(req,res){
	var db = req.db;
	console.log("my db name is " + db);
	var collection = db.get('usercollection');
	collection.find({},{},function(e,docs){
		res.render('products',{"userlist":docs});
		});
};

exports.tv = function(req,res){
	var db = req.db;
	console.log("my db name is " + db);
	var collection = db.get('tv');
	collection.find({},{},function(e,docs){
		res.render('tv1',{"userlist":docs});
		});
};

exports.ip = function(req,res){
	var db = req.db;
	console.log("my db name is " + db);
	var collection = db.get('ip');
	collection.find({},{},function(e,docs){
		res.render('ip',{"userlist":docs});
		});
};

 

exports.testtv =  function(req,res){
	var db = req.db;
	console.log("my db name is " + db);
	var collection = db.get('usercollection');
	collection.find({},{},function(e,docs){
		res.render('test',{"userlist":docs});
		});
};


exports.ph = function(req,res){
	var db = req.db;
	console.log("my db name is " + db);
	var collection = db.get('ph');
	collection.find({},{},function(e,docs){
		res.render('ph1',{"userlist":docs});
		});  
};

exports.np = function(req,res){
	var db = req.db;
	console.log("my db name is " + db);
	var collection = db.get('np');
	collection.find({},{},function(e,docs){
		res.render('np',{"userlist":docs});
		});
};
    
exports.validateUser=validateUser;

