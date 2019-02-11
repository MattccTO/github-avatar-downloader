const request = require('request');

const fs = require('fs');

const secret = require('./secrets.js');

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, callback) {
  let options = {
    url: `https://api.github.com/repos/${repoOwner}/${repoName}/contributors`,
    headers: {
      'User-Agent': 'request',
      'Authorization': `token ${secret.GITHUB_TOKEN}`
    }
  };
  request(options, function(err, response, body) {
    parsedBody = JSON.parse(body);
    callback(err, parsedBody);
  });
}

getRepoContributors('jquery', 'jquery', function(err, result) {
  console.log('Errors: ', err);
  result.forEach(function (result) {
      console.log('Avatar URL: ', result.avatar_url);
  });
});
