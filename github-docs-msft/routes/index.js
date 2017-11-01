'use strict';
var GitHub = require('github-api');
//var express = require('express');
//var router = express.Router();

/* GET home page. */

exports.index = function (req, res) {

    // Trying GitHub with no auth
    var gh = new GitHub();

    var user = gh.getUser('jamesearle');

    //var repoList = user.listOrgs({ type: "all" }, list => {
    //    res.render('index', {
    //        title: "Express",
    //        data: data
    //    });
    //});

    let repoList = user.listOrgs().then((data) => {
        //console.log(data.data[0]);
        var thing = JSON.stringify(data.data[0]);
        console.log(thing);
        res.render('index', { title: "Express", data: thing });
    });

};

//router.get('/', function (req, res) {
//    res.render('index', { title: 'Express' });
//});

//module.exports = router;
