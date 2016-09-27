// import modules
import express = require ('express');
let router = express.Router();
let mongoose = require('mongoose');

let Post = mongoose.model('Post', { // "," seperate parameters, {pass in name of model , object w| properties, values types}
    text: String,
    comments:Array,
    author: String,
    dateCreated: Date,
    dateDeleted: {
      type: Date,
      default: null
    }
  })


export = router;
