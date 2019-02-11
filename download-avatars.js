const request = require('request');

const fs = require('fs');

const secret = require('./secrets.js');

console.log('Welcome to the GitHub Avatar Downloader!');

// Get the repo contributor info from source
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

// Downloads the image and applies the correct file extension. I pulled the
// file extension from the header content type but the asynch nature of the
// program wasn't adding correctly. Added a rename function on finish but it
// was buggy. Mentor Ramses helped me find the renameSync function which worked.

function downloadImageByURL(url, filePath) {
  let fileExtension = '';
  request.get(url)
         .on('error', function(err) {
           console.log('Oopsie, there was an error!');
           throw err;
         })
         .on('response', function(response) {
           fileExtension = response.headers['content-type'].slice(6);
           // console.log(fileExtension);
           console.log(`Response Status Code: ${response.statusCode}`);
         })
         .pipe(fs.createWriteStream(filePath))
         .on('finish', function () {
           fs.renameSync(filePath, `${filePath}.${fileExtension}`)
         });
}

// Invoke the getRepoContributors function
getRepoContributors('jquery', 'jquery', function(err, result) {
  console.log('Errors: ', err);
  console.log('Now downloading avatars...');
  result.forEach(function (result) {
    let currentUserID = result.login;
    let currentURL = result.avatar_url;
    let currentFilePath = `./avatars/${currentUserID}`;
    downloadImageByURL(currentURL, currentFilePath);
  });
});