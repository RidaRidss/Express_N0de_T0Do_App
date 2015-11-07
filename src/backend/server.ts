/// <reference path='../../typings/tsd.d.ts' />
import express = require('express');
import path = require("path");
import bodyParser = require('body-parser');
import session = require('express-session');
let app : express.Express = express();
let port: number = process.env.port || 3000;
app.listen(port, () => {
    console.log("Is in listening mode.")
});

app.use(express.static("./public"));
// view engine setup

app.set('views',path.join(__dirname,"../../src/frontend/views"));
app.set('view engine',"ejs");
console.log(path.join(__dirname,"../../src/frontend/views"));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(session({
    genid: function(req) {
        return (Date.now().toString()); // use UUIDs for session IDs
    },
    secret: 'Ridss'
}));
var users : Array<{user:string,password:string}> = [];
class Users {
    user: string;
password:string;
    constructor(user: string,password:string){
        this.user = user;
        this.password = password;
    }

    login(){
        console.log(this.user + " is login");
    }
}

app.get("/", function(req, res){
    res.render("./index");
});

var i=1;
app.get("/login", function(req, res){
    if(req.body.user == users.user && req.body.password == users.password){
        req.session["isLogin"] = true;
        req.session["user"] = {user_name:users.user,id:i++};
        res.send("Login Successfully");
    } else {
        res.send("Invalid User");
    }
});
app.post("/signup",function(req,res){
    res.render("./index1");
});

app.post("/signUp",function(req,res){
    let User : Users = new Users(req.body.user,req.body.password);
    users.push(User);
    res.redirect("/login")
});


app.post("/logout", function(req, res){
    req.session["isLogin"] = false;
    req.session["user"] = null;
    res.redirect("/userdata");
});

function restrictedRoutes(req, res, next){
    if(req.session["isLogin"] != true){
        res.send("Not Authorized")
    } else {
        next();
    }
}
app.get("/Saving", restrictedRoutes, function(req, res){
    var html = "User Data Page <br><br>" + req.session["user"] + " : <a href='/logout' >Logout</a>";
    console.log(req.session);
    res.send(html);
});