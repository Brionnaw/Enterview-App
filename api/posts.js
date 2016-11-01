"use strict";
var express = require("express");
var router = express.Router();
var mongoose = require('mongoose');
var Post = mongoose.model('Post', {
    companyName: String,
    companyDomain: String,
    tag: String,
    question: {
        type: Object,
        default: null
    },
    interviewType: String,
    positionTitle: String,
    authorPhoto: String,
    author: String,
    dateCreated: Date,
    dateDeleted: {
        type: Date,
        default: null
    }
});
var Company = mongoose.model('Company', {
    companyName: {
        type: String,
        unique: true
    },
    domain: String,
});
router.post('/posts/feed', function (req, res) {
    if (req.body.id === undefined) {
        Company.find({ companyName: req.body.name }).then(function (response) {
            if (response.length === 0) {
                var newCompany = new Company({
                    companyName: req.body.name,
                    domain: req.body.domain
                });
                newCompany.save(function (err, company) {
                    if (err) {
                        console.log(err);
                        res.end();
                    }
                    else {
                        var newPost = new Post({
                            companyName: req.body.name,
                            companyDomain: req.body.domain,
                            tag: company._id,
                            interviewType: req.body.interviewType,
                            authorPhoto: req.body.authorPhoto,
                            positionTitle: req.body.positionTitle,
                            question: req.body.question,
                            author: req.body.username,
                            dateCreated: new Date()
                        });
                        newPost.save(function (err, post) {
                            if (err) {
                                console.log(err);
                                res.end();
                            }
                            else {
                                res.send(post);
                            }
                        });
                    }
                });
            }
            else {
                var newPost = new Post({
                    companyName: req.body.name,
                    companyDomain: req.body.domain,
                    tag: response._id,
                    interviewType: req.body.interviewType,
                    authorPhoto: req.body.authorPhoto,
                    positionTitle: req.body.positionTitle,
                    question: req.body.question,
                    author: req.body.username,
                    dateCreated: new Date()
                });
                newPost.save(function (err, post) {
                    if (err) {
                        console.log(err);
                        res.end();
                    }
                    else {
                        res.send(post);
                    }
                });
            }
        });
    }
    else {
        Company.findOne({ _id: req.body.tag }).then(function (company) {
            Post.findByIdAndUpdate(req.body.id, { $set: {
                    companyName: company.companyName,
                    companyDomain: req.body.domain,
                    tag: req.body.tag,
                    question: req.body.question,
                    interviewType: req.body.interviewType,
                    positionTitle: req.body.positionTitle,
                    authorPhoto: req.body.authorPhoto,
                    author: req.body.username,
                    dateCreated: new Date()
                }
            }, function (err, post) {
                if (err) {
                    console.log(err);
                    res.end();
                }
                else {
                    res.send('success');
                }
            });
        });
    }
});
router.get('/posts/company/:name', function (req, res, next) {
    Company.find({ companyName: req.params["name"] }).then(function (company) {
        if (company.length < 1) {
            res.send(['not found']);
        }
        else {
            req.body.companyInfo = company;
            next('route');
        }
    });
});
router.get('/posts/company/:name', function (req, res, next) {
    Post.find({ tag: req.body.companyInfo[0]._id }).then(function (companyPosts) {
        res.send(companyPosts);
    });
});
router.delete('/posts/feed/:id', function (req, res) {
    Post.findByIdAndUpdate(req.params["id"], { $set: { dateDeleted: new Date() } }, function (err, posts) {
        if (err) {
            console.log(err);
        }
        else {
            res.send(posts);
        }
    });
});
router.get('/posts/feed/:id', function (req, res) {
    Post.find({ author: req.params["id"], dateDeleted: null }).then(function (allProfilePosts) {
        res.send(allProfilePosts);
    });
});
router.get('/reviews/:name', function (req, res) {
    console.log(req.params["name"]);
    Post.find({ companyName: req.params["name"] }).then(function (foundPosts) {
        if (foundPosts.length < 1) {
            res.send({ message: 'false' });
        }
        else {
            console.log(foundPosts);
            res.send(foundPosts);
        }
    });
});
module.exports = router;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9zdHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJwb3N0cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQ0EsaUNBQXFDO0FBQ3JDLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUM5QixJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDbkMsSUFBSSxJQUFJLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUU7SUFDOUIsV0FBVyxFQUFFLE1BQU07SUFDbkIsYUFBYSxFQUFFLE1BQU07SUFDckIsR0FBRyxFQUFDLE1BQU07SUFDUixRQUFRLEVBQUM7UUFDUCxJQUFJLEVBQUUsTUFBTTtRQUNaLE9BQU8sRUFBRSxJQUFJO0tBQ2Q7SUFDRCxhQUFhLEVBQUUsTUFBTTtJQUNyQixhQUFhLEVBQUMsTUFBTTtJQUNwQixXQUFXLEVBQUMsTUFBTTtJQUNsQixNQUFNLEVBQUUsTUFBTTtJQUNkLFdBQVcsRUFBRSxJQUFJO0lBQ2pCLFdBQVcsRUFBRTtRQUNYLElBQUksRUFBRSxJQUFJO1FBQ1YsT0FBTyxFQUFFLElBQUk7S0FDbEI7Q0FDRixDQUFDLENBQUM7QUFHSCxJQUFJLE9BQU8sR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRTtJQUN0QyxXQUFXLEVBQUM7UUFDVixJQUFJLEVBQUMsTUFBTTtRQUNYLE1BQU0sRUFBQyxJQUFJO0tBQ1o7SUFDRCxNQUFNLEVBQUMsTUFBTTtDQUNkLENBQUMsQ0FBQztBQUdILE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLFVBQVMsR0FBRyxFQUFFLEdBQUc7SUFDMUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssU0FBUyxDQUFDLENBQUEsQ0FBQztRQUM3QixPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUMsV0FBVyxFQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFDLENBQUMs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