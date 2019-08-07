const express = require('express');
const path= require('path');
const bodyParser = require('body-Parser');
const passport = require('passport');
const mongoose = require('mongoose');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

app.set('views' , path.join(__dirname + '/views'));
app.set('view engine' , 'ejs');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname , 'public')));

//routes
app.get('/',(req , res)=>
{	
	res.render('index',{body:""});
});

mongoose.connect('mongodb://localhost/classes', {useNewUrlParser: true})
.then(()=>console.log("connected to mongodb"))
.catch(()=>console.log("Failed"));

const schema = mongoose.Schema({
	username : String,
	password : String
});

const data = new mongoose.model('users' , schema);
const data2 = new mongoose.model('teacher' , schema);

app.post('/' , async (req , res)=>{
	const a1 = await data.findOne({username : req.body.username});
	if(a1)
	{
		const token = jwt.sign({_id:a1.id} , "jwtpvtkey");
		res.header('x-auth-token', token).render('student' , {data :a1});
	}
	const a2 = await data2.findOne({username : req.body.username});
	if(a2)
	{
		const token = jwt.sign({_id: a2.id} , "jwtpvtkey");
		res.header('x-auth-token', token).render('teacher' , {data :a2});
	}

	res.send("Please Register");
});

app.listen(3000 , ()=>{
	console.log('Server up');
});