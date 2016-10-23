const express = require('express');
const bodyParser = require('body-parser');
const mail = require('./mail');
const bot = require('./bot');

var app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.post('/install', function(req, res) {
  var event = req.body;
  console.log('event', event.name);

  if (event.name === 'app.install') {
    mail(event.token);
  }
  // console.log('name', event.name);
  if (event.name === 'chat.receiveMessage') {
    bot(event);
  }

  res.writeHead(200, {
    'Content-Type': 'text/plain'
  });
  res.end('');
});

app.post('/hook', function(req, res) {
  var msg = req.body;
  console.log('hook', msg);
  res.writeHead(200, {
    'Content-Type': 'text/plain'
  });
  res.end('');
});

app.get('/', function(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/plain'
  });
  res.end('Flock CLI API');
});

app.listen(3000);

console.log('listening on port 3000');
