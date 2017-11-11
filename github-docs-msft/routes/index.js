﻿'use strict';
var GitHub = require('github-api');
var priv = require('../private');

/* GET home page. */
exports.index = function (req, res) {
    res.render('index');
};

exports.login = function (req, res) {
    //var user = req.body.user;
    //var pass = req.body.pass;

    //var gh = new GitHub({
    //    token: priv.token
    //});

    //var me = gh.getUser();

    //var msdocs = gh.getOrganization("MicrosoftDocs");


    //me.listOrgs().then(list => {
    //    console.log(list);

    //    var filtered_list = [];
    //    for (var i = 0; i < list.data.length; i++) {
    //        var name = list.data[i].login;
    //        console.log(name);
    //        filtered_list.push(name);
    //    }

    //    res.render('index', { result: filtered_list });
    //}).catch(reason => {
    //    console.log(reason);
    //});
};

exports.submit = function (req, res) {

    var gh = new GitHub({
        token: priv.token
    });

    var username = gh.getUser(req.body.user);
    var msdocs = gh.getOrganization(req.body.org);

    msdocs.getRepos().then(list => {
        var result = [];
        for (var i = 0; i < list.data.length; i++) {
            result.push(list.data[i].name);
        }
        return result;
    }).then(data => {
        var user = req.body.user;
        //var arr = [];
        console.log(user);
        for (var i = 0; i < data.length; i++) {
            (function () {
                var repoName = data[i];
                var repo = gh.getRepo(req.body.org, repoName);

                //console.log(i + " - " + req.body.org + "/" + repoName);
                (function (repoName) {
                    repo.getContributors().then(list => {
                        let contribs = list.data.filter(c => c.login === req.body.user)
                            .map(c => ({ "repoName": repoName, "contribs": c.contributions }));

                        res.render('/index', {
                            name: req.body.user,
                            contribs: contribs
                        });
                    }).catch(reason => {
                        console.log("Reason: " + reason);
                    });
                })(repoName);
            })();
        }
    }).then(result => {
        //res.render('index', { name: "Out Here"});
    }).catch(reason => {
        console.log(reason);
    });

    //console.log(repoList.then(t => { return "resolved it yo" }));

    //msdocs.getRepos().then((list) => {
    //    var results = [];
    //    console.log(list.data.length);
    //    for (var i = 0; i < list.data.length; i++) {
    //        var name = list.data[i].name;
    //        namehold = name;
    //        var repo = gh.getRepo(req.body.org, name);
    //        // check isContributor to speed this up
    //        repo.getContributors().then(list => {
    //            for (var i = 0; i < list.data.length; i++) {
    //                results.push(list.data[i].login + ", " + list.data[i].contributions + ", " + namehold)
    //            }
    //        });
    //    }
    //}).then(results => {
    //    res.render('index', { result: results });
    //}).catch(reason => {
    //    console.log(reason);
    //});
};
