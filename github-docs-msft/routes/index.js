'use strict';
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
    res.myArray = [];

    var gh = new GitHub({
        token: priv.token
    });

    //var username = gh.getUser(req.body.user);
    var org = gh.getOrganization(req.body.org);

    org.getRepos().then(list => {
        var result = [];
        for (var i = 0; i < list.data.length; i++) {
            result.push(list.data[i].name);
        }
        return result;
    }).then(data => {
        var user = req.body.user;
        console.log(user);

        let myArray = [];

        let promiseArray = data.map(repoName => {
            let repo = gh.getRepo(req.body.org, repoName);

            return repo.getContributors().then(contributors => {
                if (contributors.data) {
                    let userArray = contributors.data.filter(c => c.login === req.body.user);

                    if (userArray.length != 0) {
                        let obj = {
                            name: req.body.user,
                            repo: req.body.org + "/" + repoName,
                            contribs: userArray[0].contributions
                        };
                        console.log(obj);
                        myArray.push(obj);
                        return obj;
                    }
                }
            });
        });

        Promise.all(promiseArray).then(data => {
            // res.render?
            let results = [];
            data.forEach(contrib => {
                if (contrib) {
                    results.push(contrib);
                }
            })

            if (results.length > 0) {
                res.render('index', {
                    name: results[0].name,
                    contribs: results
                });
            } else {
                res.render('index', {
                    message: "No results for " + req.body.user
                });
            }
            console.log(results);
        });

        console.log(myArray);

        // from Jeremy
        // *****
        ////when finished, contributorFetches contains an array of Promises
        //let  contributorFetches  =  data.map(repoName  =>  {
        //    let  repo  =  gh.getRepo(req.body.org,  repoName);

        //    //this return is returning a promise... that's because getContributors() returns
        //    //a promise as do any then() functions appended to it
        //    return  repo.getContributors()

        //        //this extra then() just makes the code more readable
        //        //it rightly calls the parameter "response" because that's what it is
        //        //then it returns the data (which we know to be the contributors)
        //        .then(response  =>  response.data)

        //        //then this then() calls its parameter contributors
        //        .then(contributors  =>  {
        //            contributors
        //                //filter the list down to the one that matches the current user
        //                //at this level, I like to use a single-letter parameter name like 'c'
        //                .filter(c  =>  c.login  ===  req.body.user)

        //                //and return the object you want to be the "payload" of the promise
        //                .map(c  =>  ({
        //                    name:  req.body.user,
        //                    repo:  `${req.body.org}/${repoName}`,
        //                    contribs:  c.contributions
        //                }))
        //        })
        //});

        //Promise.all(contributorFetches).then( cf  =>  {
        //    //cf is an array of whatever each of the promises returned, which we determined
        //    //(which our contributors.filter.map) to be an array of {name,repo,contribs}
        //})
        // *****

        
    }).catch(reason => {
        console.log(reason);
    });
};
