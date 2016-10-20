// import modules
import express = require ('express');
let router = express.Router();
let mongoose = require('mongoose');
let passport = require('passport');
let crypto = require('crypto');
let jwt= require('JSonwebtoken');

//Model
let User = mongoose.model('User', {
  email: String,
  username:{
    type:String,
    unique:true
  },
  photoUrl:String,
  password: String,
  salt:String,
})

// Post- register user
router.post('/users/register', function(req, res) {
  User.find({username: req.body.username}, function(err, user) {
    // this is for checking if username exist
    if(user.length < 1) {
      let salt = crypto.randomBytes(16).toString('hex');
      let hash = crypto.pbkdf2Sync(req.body.password, salt, 1000, 64).toString('hex');
      let newUser = new User({
        email: req.body.email,
        username:req.body.username,
        password:hash,
        salt:salt,
        photoUrl:req.body.photoUrl
      })

    // Post - save user
    newUser.save((err, user) => {
       if(err) {
         res.send(err);
       }else {
         let hash =  crypto.pbkdf2Sync(req.body.password, user.salt, 1000, 64).toString('hex');
         let today = new Date();
         let exp = new Date(today);
        exp.setDate(today.getDate()+ 36500);
        //TOKEN
         let token = jwt.sign({
           photoUrl: user.photoUrl,
           id: user.id,
           username: user.username,
           exp: exp.getTime()/ 1000},
           'SecretKey'
         );
          console.log(token)
         res.send({token:token}); // end response
      }
      })
    } else {
      res.send({message:'username already exist'});
    }

    });
})
    //POST - login user
    router.post('/users/login', function(req, res) {
      User.find({username: req.body.username}, function(err, user) {
        if(user.length <1) {
        res.send({message:'incorrect username'});
      }else{
        let hash =  crypto.pbkdf2Sync(req.body.password, user[0].salt, 1000, 64).toString('hex');
        let today = new Date();
        let exp = new Date(today);
       exp.setDate(today.getDate()+ 36500);
       //TOKEN
        let token = jwt.sign({
          photoUrl:user[0].photoUrl,
          id:user[0]. id,
          username: user[0].username,
          exp: exp.getTime()/ 1000},
          'SecretKey'
        );
        if(hash === user[0].password) {
          res.send({message:"Correct", jwt:token}); // send back token
      } else {
        res.send({message:"Incorrect password"});
      }
    }
  })
  });

  //UPDATE photo
router.post('/users/photo', function(req, res) {
  console.log(req.body)
  User.findByIdAndUpdate(req.body.id, {$set:{photoUrl: req.body.url}}, (err, user) => {
      if (err) {
         console.log(err);
         res.end()
       } else {
         console.log(user);
         res.end()
       }
     });

})

//Current User
router.get('/users/currentUser/:id', function(req, res) {
    User.findOne({_id:req.params["id"]}).then(function (user) {
      console.log(user)
      res.send([user])
    })

})




    // export router
    export = router;
