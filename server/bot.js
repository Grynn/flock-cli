const flock = require('flockos');
const exec = require('child_process').exec;
const request = require('request');

module.exports = function(event) {
  var text = '';
  const BOT_TOKEN = '6e9d2ddc-d62f-4bba-8c90-d6962b342fce';

  if (event.message) {
    text = event.message.text;
  }

  _getManEntryAndSendResponse(event.message.text);

  function _sendResponse(resp) {
    var options = {
      url: 'https://api.flock.co/v1/chat.sendMessage',
      method: 'POST',
      form: {
        token: BOT_TOKEN,
        to: event.userId,
        text: resp,
        flockml: resp
      }
    };
    request(options, function(error, response, body) {
      if (error) {
        console.error(error);
      }

      var statusCode = response.statusCode;
      if (statusCode === 200) {
        console.log(body);
      }
      console.log(statusCode);
    });
  }

  function _getManEntryAndSendResponse(text) {
    exec(`man ${text}`, function(error, stdout, stderr) {
      if (error) {
        _sendResponse(stderr);
        return;
      }

      var markup = _parseManual(stdout);
      _sendResponse(markup);
    });
  }

  function _parseManual(data) {
    var markup = '<flockml>';
    var nameFlag = false;
    var descFlag = false;
    data.split('\n').every(row => {
      // console.log(row.indexOf('N\bNA\bAM\bME\bE'), row);
      if (nameFlag) {
        if (!row.trim()) {
          nameFlag = false;
        }
        row = row.trim().split('-')[row.trim().split('-').length - 1];
        row = row.trim();
        markup += `<b>${row}</b><br/>`;
      }

      if (descFlag) {
        if (!row.trim()) {
          return false;
        }
        markup += `${row.trim()}<br/>`;
      }
      if (row.indexOf('N\bNA\bAM\bME\bE') !== -1) {
        nameFlag = true;
      }
      if (row.indexOf('D\bDE\bES\bSC\bCR\bRI\bIP\bPT\bTI\bIO\bON\bN') !== -1) {
        descFlag = true;
      }
      return true;
    });

    markup += '</flockml>';

    // console.log(markup);

    return JSON.stringify(markup).replace(/\\b/g, '');
  }
};
