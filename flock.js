const flock = require('flockos');
const fs = require('fs');
const http = require('http');
const dropbox = require('dropbox');

var dbx = new dropbox({
  accessToken: 'kw1vXAtUGMMAAAAAAAAQci8heLagRTwSBk0RjSyUVv7jnpGeMbhZ8Zx3DuHZrz5p'
});

module.exports = {
  'getUserContacts': function(options) {
    return new Promise(function(resolve, reject) {
      flock.callMethod('roster.listContacts', options.token, undefined, function(error, response) {
        if (error) {
          reject(error);
        }
        var contacts = response;

        if (!contacts.length) {
          reject('No contacts found associated with this token. Please add some contacts and try again?');
        }
        resolve(contacts);
      });
    });
  },
  'getGroups': function(options) {
    return new Promise(function(resolve, reject) {
      flock.callMethod('groups.list', options.token, undefined, function(error, response) {
        if (error) {
          reject(error);
        }
        var groups = response;

        if (!groups.length) {
          reject('No group found associated with this token. Please get added to some groups and try again?');
        }

        resolve(groups);
      });
    });
  },
  'uploadFile': function(file) {
    return new Promise(function(resolve, reject) {
      fs.readFile(file, (error, data) => {
        if (error) {
          reject(error);
        }
        // console.log(data);
        var fileName = file.split('/')[file.split('/').length - 1];
        dbx.filesUpload({
          path: '/Public/flockathon/' + fileName,
          contents: data
        }).then(function(response) {
          var link = dbx.sharingCreateSharedLink({
            path: response.path_lower,
            short_url: false
          }).then(link => {
            link = link.url;
            link = link.split('?')[0];
            link += '?dl=1';
            // console.log(link);
            resolve(link);
          });
        }).catch(function(error) {
          reject(error);
        });
      });
    });
  }
}
