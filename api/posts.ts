// import modules
import express = require ('express');
let router = express.Router();
let mongoose = require('mongoose');
let Post = mongoose.model('Post', { // "," seperate parameters, {pass in name of model , object w| properties, values types}
    companyName: String,
    companyDomain: String,
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
// POST TO UPDATE OR CREATE POSTS
router.post('/posts/feed', function(req, res) {
  if(req.body.id === undefined){
    let newPost = new Post ({
      companyName: req.body.name,
      companyDomain: req.body.domain,
      interviewType: req.body.interviewType,
      authorPhoto: req.body.authorPhoto,
      positionTitle:req.body.positionTitle,
      question: req.body.question,
      author:req.body.username,
      dateCreated:new Date()
  })
      newPost.save((err, post) => {
        if(err){
          console.log(err)
          res.end()
      } else {
          res.send(post);
       }
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
