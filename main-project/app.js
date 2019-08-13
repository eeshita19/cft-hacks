require("dotenv").config();
const express=require("express");
const ejs=require("ejs");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const session=require("express-session");
const passport=require("passport");
const passportLocalMongoose=require("passport-local-mongoose");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');
var LocalStrategy = require('passport-local').Strategy;



const app=express();

app.use(express.static("public"));
app.set('view engine','ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use(session({
    secret:"raunakNegi",
    resave:false,
    saveUninitialized:true,
}));


app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/cordonaDB",{useNewUrlParser:true});
mongoose.Promise=global.Promise;
mongoose.set('useCreateIndex',true);

const cordonaSchema= new mongoose.Schema({
    username:String,
    profession:String,
    email:String,
    password:String,
});

cordonaSchema.plugin(passportLocalMongoose);
cordonaSchema.plugin(findOrCreate);

const Cordona=new mongoose.model("Cordona",cordonaSchema);

passport.use(new LocalStrategy(Cordona.authenticate()));

passport.serializeUser(Cordona.serializeUser());
  
passport.deserializeUser(Cordona.deserializeUser());


  
app.get("/",function(req,res){
    res.render("index");
});


app.get("/doc",function(req,res){
    res.render("doc");
});

app.get("/donations",function(req,res){
    res.render("Donations");
})

app.get("/internships",function(req,res){
    res.render("Intern");
})

app.get("/appointments",function(req,res){
    res.render("Appointment");
})

app.get("/medicines",function(req,res){
    res.render("Medicines");
})

app.get("/login",function(req,res){
    res.render("login");
});

app.get("/register",function(req,res){
    res.render("register");
});

app.get("/patients",function(req,res){
  
    res.render("patients");
    
    
});

app.get("/logout",function(req,res){
    req.logout();
    res.redirect("/");
})

app.get("/faq",function(req,res){
    res.render("FAQ");
})


app.post("/login", function(req,res){
    const new_user=new Cordona({
        username:req.body.uname,
        password:req.body.psw
    });
    req.login(new_user,function(err){
        if(err){
            console.log(err);
            res.send("error. Please try again");
            
        }else{
            
                res.redirect("/patients");
        }
    })
    
});

app.post("/register",function(req,res){
    Cordona.register({username:req.body.Name,email:req.body.email,profession:req.body.profession},req.body.psw,function(err,user){
        if(err){
            console.log(err);
            res.send("error. Please try again");
        }else{
            console.log("working");
                if(req.body.profession==="Doctors"){
                    res.redirect("/doctors");

                }
                else{
                res.redirect("/patients");
                }
               
        }
    });
});

app.listen(3000,function(){
    console.log("server initiated at port 3000");
    
});
