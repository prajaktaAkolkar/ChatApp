
    
//node server 
const io = require('socket.io')(7000);
const mysql = require("mysql2");
const users = {};
var http = require("http").createServer(app);
var express = require("express");

const { connect } = require('http2');

var app = express();
app.use(function (request, result, next) {
	result.setHeader("Access-Control-Allow-Origin", "*");
	next();
});


//Create Connection 
var conn = mysql.createConnection({
   host :"localhost",
   user : "root",
   password : "",
   database :"chat_app"
});



conn.connect(function(error){
    //shoe err ifany
    if(error){
        console.log("not connected");
    }
    else{
        console.log("Connected to Mysql")
    }
})



io.on('connection',(socket)=>{
//If any user Joins,let other users connected to the server know

    socket.on('new-user-joined', (name) =>{
        console.log("new User",name);
    users[socket.id] = name;
    socket.broadcast.emit('user-joined',name);
   
    })

    
   

    //If some one sends the message broadcast it to other people
    socket.on('send',message =>{
       
        socket.broadcast.emit('receive', {message : message , name: users[socket.id]});


        
        /*
        //SAve message in database
        conn.query("INSERT INTO messages (message) VALUES ('"+ message +"')", function (error,result){

        });*/
        conn.query("INSERT INTO messages (message,name,send_name) VALUES ('" + message + "','" +users[socket.id]+"','"+socket.id+"')", function (error, result) {
			console.log("data inserted");
		});
  
      
    });


    //If someone leavethe chatlet others know
    socket.on('disconnect', message => {
        socket.broadcast.emit('left' , users[socket.id]);
        delete users[socket.id];
    });
})


//Create API for get message
app.get("/get_messages",(request,result)=>{
   conn.query("SELECT * FROM messages",function(error,messages){
       result.end(JSON.stringify(message));
   })
})


console.log("server running at 7000");

