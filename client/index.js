#!/usr/bin/env node

const stdio = require('stdio');
const flock = require('flockos');
const http = require('http');
const methods = require('./flock');
const fs = require('fs');
const express = require('express');
const menu = require('./menu');

var app = express();

flock.setAppId('f7fb6b54-c44a-4a3c-b0e8-b70c0b4e545a');
flock.setAppSecret('c2ef2ad9-472c-4587-b14a-df18b13416fb');

var options = stdio.getopt({
  'token': {
    key: 't',
    description: 'Specify the Flock API token.',
    args: 1
  },
  'text': {
    key: 'm',
    description: 'Specify the text message you want to send',
    args: 1
  },
  'to': {
    key: 'u',
    description: `Specify the user you want to send the message to in format "first_name<space>last_name"`,
    args: 1
  },
  'group': {
    key: 'g',
    description: 'Specify the group you want to send the message to',
    args: 1
  },
  'flockml': {
    description: 'Specify Flock Markup language',
    args: 1
  },
  'file': {
    key: 'f',
    description: 'Specify file path to upload',
    args: 1
  },
  'image': {
    description: 'Specify URL of the image',
    args: 1
  }
});

if (!options.token) {
  if (!process.env.FLOCK_TOKEN) {
    console.error('Please provide a valid authentication token');
    process.exit(1);
  }
  options.token = process.env.FLOCK_TOKEN;
}

var users, groups;

Promise.all([methods.getUserContacts(options), methods.getGroups(options)])
  .then(([users, groups]) => {
    users = users;
    groups = groups;
    if (!options.to && !options.group) {
      return menu.drawUserMenu(users, groups, options)
        .then(menu.drawMessageMenu)
        .then(() => {
          return [users, groups];
        });
    } else {
      return [users, groups];
    }
  }).then(validateAndSendMessage)
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

function validateAndSendMessage([users, groups]) {
  if (options.flockml) {
    options.text = options.flockml;
  }

  if (!options.text && !options.file) {
    console.error('Please provide a message or attachment<file> to send');
    process.exit(1);
  }

  var contacts = users;
  if (!options.to && options.group) {
    contacts = groups;
  }

  contacts.filter(contact => {
    if (options.to) {
      var first = options.to.split(' ')[0];
      var last = options.to.split(' ')[1];
      if (contact.firstName === first && contact.lastName === last) {
        options.to = contact.id;
      }
    } else if (options.group) {
      contacts.filter(group => {
        if (group.name === options.group) {
          options.group = group.id;
        }
      });
    }
  });

  var promise = Promise.resolve(false);

  if (options.file) {
    promise = methods.uploadFile(options.file);
  }

  promise.then(link => {
      options.file = link;
      return options;
    })
    .then(_sendMessage)
    .catch(function(error) {
      console.log(error);
      process.exit(1);
    });
}

function _sendMessage(options) {
  var reciever = options.to || options.group;

  var message = {
    to: reciever,
    text: options.text
  };

  if (options.file) {
    // console.log(options.file);
    message.attachments = [{
      'downloads': [{
        'src': options.file,
        'fileName': options.file
      }]
    }];
  }

  if (options.image) {
    message.text = options.image;
    message.attachments = [{
      'views': {
        'image': {
          'original': {
            'src': options.image,
            'height': 500
          }
        }
      }
    }];
  }

  message.flockml = options.flockml || '';

  flock.callMethod('chat.sendMessage', options.token, message, function(error, response) {
    if (!error) {
      console.log(response);
    } else {
      console.error(error);
    }
  });
}
