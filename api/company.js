"use strict";
var express = require("express");
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var request = require('request');
var ipAddress = require('node-local-ip-address')();
router.post('/company', function (req, res) {
    request('https://sk_792329b163b90c6db62cfb69425122dc@company.clearbit.com/v2/companies/find?domain=' + req.body.domain, function (error, response, body) {
        var data = JSON.parse(body);
        if (data.name === req.body.company) {
            res.send(data);
        }
        else {
            console.log(error);
            res.send({ message: 'company not found' });
        }
    });
});
router.post('/company/glassdoor', function (req, res) {
    request('http://api.glassdoor.com/api/api.htm?v=1&format=json&t.p=98780&t.k=f1fG9TfuznC&action=employers&q=' + req.body.company + '&userip=' + ipAddress + '&useragent=Mozilla/%2F4.0', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.send(response);
        }
        else {
            console.log(error);
            res.send(response);
        }
    });
});
module.exports = router;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGFueS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNvbXBhbnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUNFLGlDQUFxQztBQUNyQyxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDOUIsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ25DLElBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNuQyxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDL0IsSUFBSSxHQUFHLEdBQUUsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQ2pDLElBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNqQyxJQUFJLFNBQVMsR0FBRyxPQUFPLENBQUMsdUJBQXVCLENBQUMsRUFBRSxDQUFDO0FBR3JELE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLFVBQVMsR0FBRyxFQUFFLEdBQUc7SUFDdkMsT0FBTyxDQUFDLDRGQUE0RixHQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUNwSCxVQUFVLEtBQUssRUFBRSxRQUFRLEVBQUUsSUFBSTtRQUM3QixJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQzNCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQ25DLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDakIsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQTtZQUNsQixHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUMsT0FBTyxFQUFDLG1CQUFtQixFQUFDLENBQUMsQ0FBQTtRQUN6QyxDQUFDO0lBQ0gsQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQztBQUdILE1BQU0sQ0FBQyxJQUFJLENBQUMsb0JBQW9CLEVBQUUsVUFBUyxHQUFHLEVBQUUsR0FBRztJQUNqRCxPQUFPLENBQUMsb0dBQW9HLEdBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLEdBQUMsVUFBVSxHQUFDLFNBQVMsR0FBQywyQkFBMkIsRUFDOUssVUFBVSxLQUFLLEVBQUUsUUFBUSxFQUFFLElBQUk7UUFDN0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUksUUFBUSxDQUFDLFVBQVUsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ3pDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUE7UUFDcEIsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQTtZQUNsQixHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFBO1FBQ3BCLENBQUM7SUFDSCxDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFDO0FBR0gsaUJBQVMsTUFBTSxDQUFDIn0=