let router = require('express').Router();
let User = require('../db').import('../models/user');
const jwt = require("jsonwebtoken");// adding token and storing it in variable jwt to later use it in below code for create and post
const bcrypt =require("bcryptjs")// adding bcrypt and storing it in variable jwt to later use it in below code for create and post, this will make sure username and pasward are secure

router.post('/create', function (req, res){
    User.create({
        email:req.body.user.email,
        password: bcrypt.hashSync(req.body.user.password,13)

    })
    .then(
        function createSuccess(user){
            let token = jwt.sign({id: user.id, email:user.email}, process.env.JWT_SECRET,{expiresIn: 60 * 60 * 24});// added jwt.sign for userID and email
            res.json({
                user: user,
                message: 'User sucessfully created!',
                sessionToken: token
            });
        }
    )
    .catch(err => res.status(500).json({error: err}))

});

router.post('/login', function (req, res){
    User.findOne({
        where:{
            email:req.body.user.email
        }
    })
    .then(function loginSuccess(user){
        if (user){
            //syntax----bcrypt.compare(s, hash, callbackFunction, progressCallbackFunction)
            /*
                
                s	string	Data to compare
                hash	string	Data to be compared to
                callback	function(Error, boolean)	Callback receiving the error, if any, otherwise the result
                progressCallback	function(number)	Callback successively called with the percentage of rounds completed (0.0 - 1.0), maximally once per MAX_EXECUTION_TIME = 100 ms.
            */
            bcrypt.compare(req.body.user.password, user.password, function(err, matches){// added bcrypt to secure the username and password
                if (matches){
                    //    adding jwt to secure user ID, prcess saved in evn file, expiring in 24 hrs
                    let token = jwt.sign({id: user.id}, process.env.JWT_SECRET,{expiresIn: 60 * 60 * 24});

                    res.status(200).json({
                        user: user,
                        message: 'User sucessfully logged in!',
                        sessionToken: token
                    })
                } else{
                    res.status(502).send({error:"Login Failed"});
                }
            });
        }
        else{
            res.status(500).json({error: 'User does not exist.'})
        }
    })
    .catch(err => res.status(500).json({error: err}))

});

module.exports = router;