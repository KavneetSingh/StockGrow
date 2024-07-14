const mongoose= require('mongoose');
const indicesData= require('./indices');
const Indice= require('../models/Indices');

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


const initDB= async() => {
    await Indice.deleteMany({});
    await Indice.insertMany(indicesData);
    console.log("Indices added successfully");
}

initDB();