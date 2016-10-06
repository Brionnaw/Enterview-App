  // import modules
  import express = require ('express');
  let router = express.Router();
  let mongoose = require('mongoose');
  let passport = require('passport');
  let crypto = require('crypto');
  let jwt= require('JSonwebtoken');
  let request = require('request');
  let Glassdoor = require('machinepack-glassdoor');

  //Model
  let Company = mongoose.model('Company', {
    companyName:String,
    domain:String,
  })
  //API CLEARBIT
  router.post('/company', function(req, res) {
    request('https://sk_792329b163b90c6db62cfb69425122dc@company.clearbit.com/v2/companies/find?domain='+req.body.domain, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log(body)
        res.send(response)
        // Show the HTML for the Google homepage.
      } else {
        console.log(error)
        res.send(response)
      }
    })
  })
  //glassdoor api
  router.post('/company/glassdoor', function(req, res) {
    // Get company information
      Glassdoor.getCompany({
        partnerId: '98780',
        partnerKey: 'f1fG9TfuznC',
        userIp: '0.0.0.0',
        userAgent: '',
        q: req.body.glassdoorCompany,
        l: '',
      }).exec({
        // An unexpected error occurred.
        error: function (err){

        },
        // OK.
        success: function (){

        },
      });
  })

















  // export router
  export = router;
