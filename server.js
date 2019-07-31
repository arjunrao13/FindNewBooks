const express = require('express');
const mongoose = require('mongoose');
const app = express();

const users = require('./routes/api/users');
const profile = require('./routes/api/profile');

const passport = require('passport');

const bodyParser = require('body-parser')

const db = require('./config/keys').mongoURI;
mongoose
.connect(db)
.then(() => console.log('MongoDb connected'))
.catch(err => console.log(err));

//Passport middleware
app.use(passport.initialize());

//Passport config
require('./config/passport')(passport)

//Body parser middleware(configuration)
app.use(bodyParser.urlencoded({extended: false}
));
app.use(bodyParser.json());

//Let's write our first route
app.get('/', (req, res) => res.send('Hello world'));

app.use('/api/users', users);
app.use('/api/profile', profile);


const port = 5002
app.listen(port, () => console.log(`Server is running on port ${port}`));
