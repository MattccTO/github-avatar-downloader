const request = require('request');

const fs = require('fs');

require('dotenv').config();

console.log('Welcome to the GitHub Avatar Downloader!');

const owner = process.argv.slice(2, 3).toString();
const repo = process.argv.slice(3).toString();

function errorChecker() {
  let noErrors = true;
  if (fs.existsSync('./.env') === false) {
    console.log('Environment variables file does not exist. Please create and retry.');
    noErrors = false;
  } else if (!process.env.githubToken) {
    console.log('Environment variables file does not contain Github Authorization Token. Please add token and retry.');
    noErrors = false;
  }
  if (process.argv.length !== 4) {
    console.log('Please enter the repo owner and repo name as one string each, only.');
    noErrors = false;
  }
  return noErrors;
}

// Get the repo contributor info from source
function getRepoContributors(repoOwner, repoName, callback) {
  if (errorChecker() === true) {
    const options = {
      url: `https://api.github.com/repos/${repoOwner}/${repoName}/contributors`,
      headers: {
        'User-Agent': 'request',
        Authorization: `token ${process.env.githubToken}`
      }
    };
    request(options, (err, response, body) => {
      if (response.statusCode === 404) {
        console.log('404 Response Code: Invalid repo owner and repo name combination.');
      } else if (response.statusCode === 401) {
        console.log('401 Response Code: Invalid Github Authorization Token.');
      } else if (err) {
        console.log(err);
      } else {
        const parsedBody = JSON.parse(body);
        callback(err, parsedBody);
      }
    });
  }
}

// Downloads the image and applies the correct file extension. I pulled the
// file extension from the header content type but the asynch nature of the
// program wasn't adding correctly. Added a rename function on finish but it
// was buggy. Mentor Ramses helped me find the renameSync function which worked.

function downloadImageByURL(url, filePath) {
  let fileExtension = '';
  request.get(url)
    .on('error', (err) => {
      console.log('Oopsie, there was an error!');
      throw err;
    })
    .on('response', (response) => {
      fileExtension = response.headers['content-type'].slice(6);
      // console.log(fileExtension);
      console.log(`Response Status Code: ${response.statusCode}`);
    })
    .pipe(fs.createWriteStream(filePath))
    .on('finish', () => {
      fs.renameSync(filePath, `${filePath}.${fileExtension}`);
    });
}

// Invoke the getRepoContributors function
getRepoContributors(owner, repo, (err, result) => {
  if (err) {
    console.log('Errors: ', err);
  }
  const targetPath = './avatars/';
  if (fs.existsSync(targetPath) === false) {
    fs.mkdir(targetPath, (error) => {
      if (error) {
        console.log('Errors: ', error);
      }
    });
  }
  console.log('Now downloading avatars...');
  result.forEach((array) => {
    const currentUserID = array.login;
    const currentURL = array.avatar_url;
    const currentFilePath = `${targetPath}${currentUserID}`;
    downloadImageByURL(currentURL, currentFilePath);
  });
});
