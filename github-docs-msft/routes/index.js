'use strict';
var GitHub = require('github-api');
var private = require('../private');

/* GET home page. */
exports.index = function (req, res) {
    res.render('index');
};

exports.login = function (req, res) {
    var user = req.body.user;
    var pass = req.body.pass;

    var gh = new GitHub({
        token: private.token
    });

    var me = gh.getUser();

    var msdocs = gh.getOrganization("MicrosoftDocs");


    me.listOrgs().then(list => {
        console.log(list);

        var filtered_list = [];
        for (var i = 0; i < list.data.length; i++) {
            var name = list.data[i].login;
            console.log(name);
            filtered_list.push(name);
        }

        res.render('index', { result: filtered_list });
    }).catch(reason => {
        console.log(reason);
    });
};

exports.default_auth = function (req, res) {

    var gh = new GitHub({
        token: private.token
    });

    var username = gh.getUser(req.body.user);
    var msdocs = gh.getOrganization(req.body.org);

    //var namehold;

    msdocs.getRepos().then(list => {
        var result = [];
        for (var i = 0; i < list.data.length; i++) {
            result.push(list.data[i].name);
        }
        //res.render('index', { result: result });
        return result;
    }).then(data => {
        var namehold;
        for (var i = 0; i < data.length; i++) {
            (function () {
                var repoName = data[i];
                namehold = repoName;
                var repo = gh.getRepo(req.body.org, repoName);

                console.log(i + " - " + req.body.org + "/" + repoName);
                //console.log("\n");
                (function (repoName) {
                    repo.getContributors().then(list => {
                        for (i = 0; i < list.data.length; i++) {
                            (function (i) {
                                console.log(i + " - " + list.data[i].login + ", " + repoName);
                            })(i);
                        }
                    }).catch(reason => {
                        console.log("Reason: " + reason);
                    })
                })(repoName);
            })();
        }
    }).then(result => {
        res.render('index', { result: result });
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
