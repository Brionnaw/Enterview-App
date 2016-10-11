// import modules
import express = require ('express');
let router = express.Router();
let mongoose = require('mongoose');
let Post = mongoose.model('Post', { // "," seperate parameters, {pass in name of model , object w| properties, values types}
    companyName: String,
    companyDomain: String,
    tag:String,
      question:{
        type: Object,
        default: null
      },
      interviewType: String,
      positionTitle:String,
      authorPhoto:String,
      author: String,
      dateCreated: Date,
      dateDeleted: {
        type: Date,
        default: null
  }
})
//Model
let Company = mongoose.model('Company', {
  companyName:String,
  domain:String,
})
// POST TO UPDATE OR CREATE POSTS
router.post('/posts/feed', function(req, res) {
  if (req.body.id === undefined){
    Company.find({companyName:req.body.companyName}).then(function(response) {
        if(response.length === 0){
          let newCompany = new Company ({
            companyName: req.body.companyName,
            domain:req.body.companyDomain
          })
          newCompany.save((err, company) => {
            if(err) {
              console.log(err)
              res.end()
            } else {
              res.send(company);
            }// conditionals to create a new company 
          })
        } else {
        Post.findByIdAndUpdate(req.body.id,
        {$set:{
          question: req.body.question,
          interviewType:req.body.interviewType,
          positionTitle:req.body.positionTitle}
        },
          (err, res) => {
          if (err) {
             console.log(err);
           } else {
             console.log(res);
           }
         });
         res.send('200')
       }
     })
   }
});

//GET ALL POSTS
router.get('/posts/feed/:company', function(req , res) {
  Post.find({domain:req.params["company"]}).then(function(allPosts) {
    console.log(allPosts)
    res.json(allPosts)
  });
});
router.delete('/posts/feed/:id', function (req, res) {
    console.log('hit')
  Post.findByIdAndUpdate(req.params["id"], {$set:{dateDeleted:new Date()}}, (err, res) => {
    if (err) {
         console.log(err);
       } else {
         console.log(res);
       }
     });
     res.send('success!')
  });
  // get all profile prost that arent deleted //
   router.get('/posts/feed/:id', function (req, res){
     Post.find({author:req.params["id"], dateDeleted:null}).then(function(allProfilePosts){
       res.send(allProfilePosts);
      })
   })

export = router;
