const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const axios = require('axios');
const Book = require('../../models/Book');
// Load Profile Model
const Profile = require('../../models/Profile');



//@route   GET api/profile/search
//@desc    Get book by search term
//@access  Public
router.get('/search', (req, res) => {
    const term = req.body.searchTerm;
    const API_URL = `https://www.googleapis.com/books/v1/volumes`;
     axios
    .get(`${API_URL}?q=${term}&maxResults=40`)
    .then(result => {
        const books = result.data;
        const bookAuthors = authors => {
            if(authors === undefined){
              return authors;
            }
            if (authors.length <= 2) {
              authors = authors.join(", ");
            } 
            else if (authors.length > 2) {
              let lastAuthor = " and " + authors.slice(-1);
              authors.pop();
              authors = authors.join(", ");
              authors += lastAuthor;
            }
            return authors;
          };
          const ret = []
        for(let i = 0; i < books.items.length; i++){
            
            
            const newBook = new Book ({
                volID : books.items[i].volumeInfo.id,
                title : books.items[i].volumeInfo.title,
                authors : bookAuthors(books.items[i].volumeInfo.authors),
                publishDate : books.items[i].volumeInfo.publishedDate,
                description : books.items[i].volumeInfo.description
            });
            ret.push(newBook);

        }
         res.json(ret);
    })
    .catch(err => {
        console.log(err);
    })
    
    
    
})

//@route   GET api/profile/add
//@desc    Add a book to read later
//@access  Private





module.exports = router;