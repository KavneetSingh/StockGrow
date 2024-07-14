const mongoose= require("mongoose");


const indexSchema= new mongoose.Schema({
    route: {
        type: String,
        required: true
    },
    symbol: {
        type: String,
        required: true
    }
});

const Indice= new mongoose.model("Indice", indexSchema);

module.exports= Indice;