const express= require("express");
const app= express();
const port= 8080;
const mongoose= require('mongoose');
const path= require('path');
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
const ejsMate= require('ejs-mate');
app.engine("ejs", ejsMate);
// const axios = require('axios');
const { NseIndia }= require('stock-nse-india/build/index.js');
const  nseIndia = new NseIndia();
const Indice= require("./models/Indices");
const User= require('./models/user.js');
const passport= require("passport");
const LocalStrategy= require('passport-local');
const session= require("express-session");
const { saveRedirectUrl } = require('./middleware.js');

const methodOverride= require("method-override");
app.use(methodOverride('_method'));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/StockGrow');
}
main()
    .then(res=>{
        console.log("connection established");
    })
    .catch(err=>{
        console.log(err);
    })

const sessionOptions= {
    secret: "mySuperSecretCode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24,
        maxAge: 1000 * 60 * 60 * 24,      //1 day session
        httpOnly: true
    }
};

app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/demouser", async (req, res)=>{
    let fakeUser= new User({
        email: "xyzrandom@gmail.com",
        username: "xyzrandom"
    })

    let registeredUser= await User.register(fakeUser, "student123");
    res.send(registeredUser);
    // console.log("Done");
})
    

function run(){
    // nseIndia.getAllStockSymbols().then(symbols  => {
    //     console.log(symbols)
    // })
    
    // nseIndia.getEquityDetails('TITAN').then(details  => {
    //     console.log(details)
    // })

    // nseIndia.getEquityStockIndices('NIFTY INFRA').then(data=>{
    //     console.log(data.metadata);
    // });

    // const range = {
    //     start: new Date("2010-01-01"),
    //     end: new Date("2021-03-20")
    // }
    // const symbol= 'TITAN';
    // nseIndia.getEquityHistoricalData(symbol, range).then(data => {
    //     console.log(data)
    // })
}

// run();

app.get("/", async(req,res)=>{
    const data= await nseIndia.getEquityStockIndices("NIFTY 50");
    const metadata= data.metadata;
    res.render("indice.ejs", {metadata, data});
});

app.get("/index/:idx", async (req,res) =>{
    const {idx}= req.params;
    console.log(idx);

    let index= await Indice.findOne({route: idx});
    // console.log(index);
    const data= await nseIndia.getEquityStockIndices(index.symbol);

    // console.log(data);
    const metadata= data.metadata;
    res.render("indice.ejs", {metadata, data});
});

app.get("/stock/:st", async(req, res)=>{
    const {st}= req.params;
    console.log(st);
    const details= await nseIndia.getEquityDetails(st);
    console.log(details);
    res.render("stock.ejs", {details});
});

app.get("/search", async (req,res)=>{
    console.log(req.query);
    const { stock }= req.query;
    console.log(stock);
    console.log("YES");
    const details= await nseIndia.getEquityDetails(stock);
    console.log(details);
    res.render("stock.ejs", {details});
});

app.get("/signup", (req, res)=>{
    res.render("users/signup.ejs")
})

app.post("/signup", async (req,res)=>{
    try{
        let {username, email, password}= req.body;
        const newUser= new User({email, username});
        const registeredUser= await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err)=>{
            if(err){
                return next(err);
            }
            // req.flash("success", "Welcome to BookYourStay!");
            res.redirect("/");
        });
    }
    catch(e){
        // req.flash("error", e.message);
        res.redirect("/signup");
    }
})

app.get("/login", (req, res)=>{
    res.render("users/login.ejs");
})

app.post(
     "/login",
     saveRedirectUrl,
    passport.authenticate("local", {failureRedirect: '/login'}), 
     async(req, res)=>{
        let redirectUrl= res.locals.redirectUrl || "/";
        console.log("here-> ", redirectUrl);
        res.redirect(redirectUrl);
    }
)


app.listen(port, (req, res)=>{
    console.log("Listing on port 8080");
});