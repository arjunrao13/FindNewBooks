const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create schema
const BookSchema = new Schema({
    volID : {
        type: String,
        required: true
    },
    title : {
        type: String,
        required: true
    },
    authors : {
        type: String,
        required: true
    },
    
    publishDate : {
        type: String,

    },
    description : {
        type: String
    },
    



});

module.exports = Book = mongoose.model('books', BookSchema);