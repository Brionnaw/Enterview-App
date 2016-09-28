// import modules
import express = require ('express');
let router = express.Router();
let mongoose = require('mongoose');

let Post = mongoose.model('Post', { // "," seperate parameters, {pass in name of model , object w| properties, values types}
      question:{
        type: Object,
        default: null
      },
      author: String,
      dateCreated: Date,
})
// POST TO UPDATE OR CREATE POSTS
router.post('/posts/feed', function(req, res) {
  if(req.body.id === undefined){
    let newPost = new Post ({
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
      Post.findByIdAndUpdate(req.body.id, {$set:{question: req.body.question}}, (err, res) => {
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
router.get('/posts/feed', function(req , res) {
  Post.find({}).then(function(allPosts) {
    res.json(allPosts)

  });
});





export = router;
