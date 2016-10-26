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
  companyName:{
    type:String,
    unique:true
  },
  domain:String,

})
// POST TO UPDATE OR CREATE POSTS
router.post('/posts/feed', function(req, res) {
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
      }
    })
  } else {
      console.log(req.body.tag);
      Company.findOne({_id : req.body.tag}).then(function(company){
        console.log(company);

        Post.findByIdAndUpdate(req.body.id,
        {$set:{
          companyName: company.companyName,
          companyDomain: req.body.domain,
          tag:req.body.tag,
          question: req.body.question,
          interviewType: req.body.interviewType,
          positionTitle: req.body.positionTitle,
          authorPhoto:req.body.authorPhoto,
          author: req.body.username,
          dateCreated: new Date()
         }
        },
          (err, post) => {
          if (err) {
             console.log(err);
             res.end()

           } else {
             console.log(post);
             res.send('success')

           }
         });
      })
    }
  });


//GET ALL POSTS
router.get('/posts/company/:name', function(req , res, next) {
  Company.find({companyName:req.params["name"]}).then(function(company) {
    if(company.length < 1) {
      res.send(company);
    } else {
      req.body.companyInfo = company;
      next('route') //middleware
    }
  })
});

router.get('/posts/company/:name', function(req , res, next) {
    Post.find({tag: req.body.companyInfo[0]._id}).then(function(companyPosts) {
      res.send(companyPosts);
    });
});


router.delete('/posts/feed/:id', function (req, res) {
  Post.findByIdAndUpdate(req.params["id"], {$set:{dateDeleted:new Date()}}, (err, res) => {
    if (err) {
         console.log(err);
       } else {
         res.send('success!')
       }
     });
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
