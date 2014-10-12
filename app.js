
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');
var mysql = require('mysql');
var ejs = require('ejs');
var app = express();
var aws = require('aws-sdk');
aws.config.update({region: 'us-east-1'});

aws.config.update({accessKeyId: 'AKIAJ4MURIQ4SDWZ2BDQ', secretAccessKey: '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'});
var moment = require('moment');
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/test');
var bodyParser = require('body-parser');
module.exports = db;
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
var DynamodbStore = require('connect-dynamodb')(express);

app.use(express.cookieParser());


app.use(express.session({ store: new DynamodbStore(aws), secret: 'keyboard cat'}));	

app.get('/dyproducts',function(req,res)
{var aws = require('aws-sdk');
aws.config.update({region: 'us-east-1'});

aws.config.update({accessKeyId: 'AKIAJ4MURIQ4SDWZ2BDQ', secretAccessKey: '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'});
var dydb = new aws.DynamoDB();

    var dydb = new aws.DynamoDB();
    var params = {
    		TableName : 'shoppingcart',
    		}
    		dydb.scan(params, function(err, data) {
    		if (err) {
    		console.log(err); // an error occurred
    		}
    		else
    		{
    		var temp=data["Items"];
    	
    		res.render('dyproducts',{title:'My Store : All Products',productArray:temp,username:req.session.username,countProduct:0});
    		}

    		});
    		
});

app.post('/addtocart/:id/:category/:cost',function(req,res)
	{
	
	console.log("i reached here");
	var aws = require('aws-sdk');
	aws.config.update({region: 'us-east-1'});
	aws.config.update({accessKeyId: 'AKIAJ4MURIQ4SDWZ2BDQ', secretAccessKey: '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'});
	var dydb = new aws.DynamoDB();
	console.log(req.session.username);
	console.log("");
	var temp=req.params.id;
	var id=temp.substring(1,temp.length-1);
	temp=null;
	temp=req.params.category;
	var product=temp.substring(1,temp.length-1);
	temp=null;
	temp=req.params.cost;
	var cost=temp.substring(1,temp.length-1);
	var params = {
			  TableName : 'cart',
			  "Key":{"id":{"S":id},"username":{"S":req.session.username}},
			  "AttributeUpdates":{"quantity":{"Value":{"N":"1"},
			"Action":"ADD"},
			"cost":{"Value":{"N":"300"},
			"Action":"ADD"},

			"category":{"Value":{"S":product},
			"Action":"PUT"}
			  }
	};
			

dydb.updateItem(params, function(err, data) {

	if (err) {

	console.log(err); // an error occurred

	//callback(err);

	}

	else {

	//console.log(data); // successful response

	console.log(data);

	}

	});

	});

app.get('/addtocart',function(req,res)
		{var aws = require('aws-sdk');
		aws.config.update({region: 'us-east-1'});

		aws.config.update({accessKeyId: 'AKIAJ4MURIQ4SDWZ2BDQ', secretAccessKey: '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'});
		var dydb = new aws.DynamoDB();

		    var dydb = new aws.DynamoDB();
		    var params = {
		    		TableName : 'cart',
		    		}
		    		dydb.scan(params, function(err, data) {
		    		if (err) {
		    		console.log(err); // an error occurred
		    		}
		    		else
		    		{
		    		var temp=data["Items"];
		    		console.log(temp);
		    	
		    		res.render('addtocart',{title:'My Store : All Products',productArray:temp,username:req.session.username,countProduct:0});
		    		}

		    		});
		    		
		});




app.use(function(req, res, next){
	req.db = db;
	next();
});




// all environments
app.set('port', process.env.PORT || 3200);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));



app.get('/', routes.index);
app.get('/users', user.list);
app.get('/signup', function(req, res){
	res.render('signup', { title: 'SignUp' });
});
app.get('./views/products.ejs', user.products);
app.get('/products', user.products);
app.get('/products1',function(req, res){
	res.render('products1', { title: 'Products' });
	});
app.get('/products2',function(req, res){
	res.render('products2', { title: 'Products' });
	});
app.get('/products4',function(req, res){
	res.render('products4', { title: 'Products' });
	});
app.get('/test',user.testtv);

app.get('/ph1', user.ph);
app.get('/tv', user.tv);
app.get('/ph', user.ph);
app.get('/tv1', user.tv);
app.get('/ip', user.ip);
app.get('/np', user.np);

app.post('/register', function (req, res) {
	if(!('firstname'))
	{
		res.statusCode = 400;
		return res.send('Error 400: FirstName cannot be empty');
	}
	else if(!('lastname'))
	{
		res.statusCode = 400;
		return res.send('Error 400: LastName cannot be empty');
	}

	else
	{
		var now = moment(new Date());
		user.createUser(req.param('firstname'),req.param('lastname'),req.param('email'),req.param('password'),now.format("D MMM YYYY") + ' ' + now.format("HH:mm"));
		 res.render('index', { title: 'Home' ,message: 'SignUp Successful.Please Login to Continue'});
	}
});

app.post('/validate', function(req, res){
	if(!req.param('email') ||!req.param('password'))
	{
		res.statusCode = 400;
		console.log('UserName/Password Missing');
		return res.render('index',{
			errormsg:'Error 400: UserName/Password field Missing'});
	}
	else
	{
		user.validateUser(function(err,results){
			if(err)
			{
				ejs.renderFile('index',{message :"Authentication Failed .Invalid UserName/Password"},	function(err, result) {
					// render on success
					if (!err) {
						res.end(result);
					}
					else {
						console.log(err);
					}
				});
			}
			else
			{
				req.session.username=req.body.email;
				res.redirect('dyproducts');
				
			}
		},req.param('email'),req.param('password'));
	}
});









http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


  
  

