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
  console.log(req.body)
  if (req.body.id === undefined){
    Company.find({companyName:req.body.companyName}).then(function(response) {
        if(response.length === 0){
          let newCompany = new Company ({
            companyName: req.body.name,
            domain:req.body.domain
          })
          newCompany.save((err, company) => { // conditionals to create a new company
            if(err) {
              console.log(err)
              res.end()
            } else {
              let newPost = new Post ({
                companyName: req.body.name,
                companyDomain: req.body.domain,
                tag:company._id,
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
   }
});

//GET ALL POSTS
router.get('/posts/company/:name', function(req , res) {
  Company.find({companyName:req.params["name"]}).then(function(company) {
      console.log(company)
      Post.find({tag:company[0]._id}).then(function(companyPosts) {
        console.log(companyPosts)
        res.send(['companyPosts'])
       });
  })
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

// pass name of company to back end point($stateParams)
// look up company by its name in data. (company.find)
// run 2 query by using post.find (using the tag)
// pass to front end and display it


// study the angular error make a document
