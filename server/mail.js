const nodemailer = require('nodemailer');
const flock = require('flockos');

module.exports = function sendMail(token) {
  flock.callMethod('users.getInfo', token, undefined, function(error, data) {
    _sendMail(data.email, token);
  });

  function _sendMail(email, token) {
    var transporter = nodemailer.createTransport('smtps://avishwa18%40gmail.com:aVishw@9795@smtp.gmail.com');

    // setup e-mail data with unicode symbols
    var mailOptions = {
      from: '"Flock CLI" <avishwa18@gmail.com>', // sender address
      to: email, // list of receivers
      subject: 'Flock CLI | Auth Token', // Subject line
      text: token, // plaintext body
      html: `Your auth token: <b>${token}</b>` // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        return console.log(error);
      }
      console.log('Message sent: ' + info.response);
    });
  }
}
