const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create schema
const ProfileSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    
    favAuthors : [
        {
            author : {
                type: String,
                required: true
            }
        }
    ],
    favBooks : [
        {
            book: {
                type: Schema.Types.ObjectId,
                ref: 'books'
            }
        }
    ],

    readLater : [
        {
            book: {
                type: Schema.Types.ObjectId,
                ref: 'books'
            }
        }
    ]

});

module.exports = Profile = mongoose.model('profiles', ProfileSchema);