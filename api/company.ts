  // import modules
  import express = require ('express');
  let router = express.Router();
  let mongoose = require('mongoose');
  let passport = require('passport');
  let crypto = require('crypto');
  let jwt= require('JSonwebtoken');
  let request = require('request');
  let ipAddress = require('node-local-ip-address')();

//API CLEARBIT
router.post('/company', function(req, res) {
  request('https://sk_792329b163b90c6db62cfb69425122dc@company.clearbit.com/v2/companies/find?domain='+req.body.domain,
  function (error, response, body) {
    let data = JSON.parse(body)
    if (data.name === req.body.company) {
      res.send(data);
    } else {
      console.log(error)
      res.send({message:'company not found'})
    }
  })
});

//GLASSDOOR API
router.post('/company/glassdoor', function(req, res) {
  request('http://api.glassdoor.com/api/api.htm?v=1&format=json&t.p=98780&t.k=f1fG9TfuznC&action=employers&q='+req.body.company+'&userip='+ipAddress+'&useragent=Mozilla/%2F4.0',
  function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.send(response)
    } else {
      console.log(error)
      res.send(response)
    }
  })
});

// EXPORT ROUTER
export = router;
