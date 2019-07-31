const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

//Load input Validation
const validateRegisterInput = require('../../validation/register');

//@route  POST api/users/register
//@desc    Register user
//@access  public route
router.post('/register', (req, res) => {
    const {errors, isValid} = validateRegisterInput(req.body);

    if(!isValid){
        return res.status(400).json(errors);
    }

    User
    .findOne({email: req.body.email})
    .then(user => {
        if(user){
            errors.email = 'Email already exists'
            return res.status(400).json(errors);
        }
        

        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        });

        bcrypt.genSalt(10, (err, salt) => {
            if (err) throw err;
            bcrypt.hash(newUser.password, salt, 
                (err, hash) => {
                    if(err) throw err;
                    newUser.password = hash;
                    newUser
                        .save()
                        .then(user => res.json(user))
                        .catch(err => console.log(err));

                })
        })

    })
    .catch(err => console.log(err));
});


//Load input Validation
const validateLoginInput = require('../../validation/login');

//@route  POST api/users/login
//@desc    Login user
//@access  public route
router.post('/login', (req, res) => {
    const {errors, isValid} = validateLoginInput(req.body);

    if(!isValid){
        return res.status(400).json(errors);
    }


    const email = req.body.email;
    const password = req.body.password;
    


    //Find user by email
    User.findOne({email})
        .then(user => {
            if(!user){
                errors.email = 'User not found';
                return res.status(404).json(errors);
            }
            //Check password
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if(isMatch){
                        //Create a JWT payload
                        const payload = {
                            id: user.id,
                            name: user.name,
                            avatar: user.avatar
                        };

                        //Sign token
                        jwt.sign(payload,
                             keys.secretOrKey,
                             {expiresIn: 3600},
                             (err, token) => {
                                 res.json({
                                     success: true,
                                     token: 'Bearer ' + token
                                 })
                             }                          
                             );


                    } else{
                        errors.password = 'Password incorrect';
                        return res.status(400).json(errors);
                    }
                })
            
                
        })
        .catch(err => console.log(err));
})

router.get('/current',
    passport.authenticate('jwt', {session: false}),
    (req, res) => {
        res.json({msg: 'Success'});

})

module.exports = router;
