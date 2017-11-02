'use strict';
var GitHub = require('github-api');

/* GET home page. */
exports.index = function (req, res) {
    res.render('index');
};

exports.submit = function (req, res) {
    //var orgname = req.body.org;

    // what if they didn't fork the repo?
    // just search contributors of the repo object, don't have to have cloned

    var gh = new GitHub();
    var username = req.body.user;

    var org = "MicrosoftDocs";

    var user = gh.getUser(username);
    var msdocs = gh.getOrganization(org);

    msdocs.getRepos().then(list => {
        console.log(list.data.length);
        for (var i = 0; i < list.data.length; i++) {
            var name = list.data[i].name;
            console.log(name);
            var repo = gh.getRepo(org, name);
            // check isContributor to speed this up
            repo.getContributors().then((list, name) => {
                for (var i = 0; i < list.data.length; i++) {
                    console.log(list.data[i].login + " made " + list.data[i].contributions + " contributions to MicrosoftDocs/" + name);
                    //if (list.data[i].login === username) {
                    //    console.log();
                    //}
                }
            });
        }
    }).catch(reason => {
        console.log(reason);
    });

    res.render('index');

    //user.listRepos().then(list => {
    //    console.log(list);
    //    res.render('index', { result: JSON.stringify(list.data) });
    //})

    //var org = gh.getOrganization(orgname);

    //org.isMember(username).then(result => {
    //    console.log("Result: " + result);
    //    res.render('index', { result: result });
    //}).catch(reason => {
    //    console.log(reason);
    //});
}
