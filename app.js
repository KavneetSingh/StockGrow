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
const axios = require('axios');
const { NseIndia }= require('stock-nse-india/build/index.js');
const  nseIndia = new NseIndia();
const Indice= require("./models/Indices");

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

run();

app.get("/", (req,res)=>{
    res.render("index.ejs");
});

app.get("/index/:idx", async (req,res) =>{
    const {idx}= req.params;
    console.log(idx);

    let index= await Indice.findOne({route: idx});
    console.log(index);
    nseIndia.getEquityStockIndices(index.symbol).then(data=>{
        console.log(data.metadata);
    });
});


app.listen(port, (req, res)=>{
    console.log("Listing on port 8080");
});