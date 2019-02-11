const request = require('request');

const fs = require('fs');

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, callback) {

}

getRepoContributors('jquery', 'jquery', function(err, result) {
  console.log('Errors: ', err);
  console.log('Result: ', result);
});
