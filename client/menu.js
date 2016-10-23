const terminalMenu = require('terminal-menu');
const inquirer = require('inquirer');

module.exports = {
  'drawUserMenu': function(users, groups, options) {
    return new Promise((resolve, reject) => {
      var menu = terminalMenu({
        width: 60,
        bg: 102,
        // fg: 150,
        x: 4,
        y: 2
      });

      menu.reset();
      menu.write('Flock CLI - Select User/Group to send message\n');
      menu.write('-------------------------\n');
      menu.write('Users\n\n');
      users.forEach(user => {
        menu.add(`${user.firstName} ${user.lastName}`, function(label, index) {
          options.to = user.id;
          // console.log(user.id);
          menu.close();
          resolve(options);
        });
      });
      menu.write('-------------------------\n');
      menu.write('Groups\n\n');
      groups.forEach(group => {
        menu.add(group.name, function(label, index) {
          options.group = group.id
            // console.log(group.id);
          menu.close();
          resolve(options);
        });
      });
      process.stdin.pipe(menu.createStream()).pipe(process.stdout);

      process.stdin.setRawMode(true);
    });
  },
  'drawMessageMenu': function(options) {
    return new Promise(function(resolve, reject) {
      var questions = [{
        type: 'input',
        name: 'message',
        message: 'Please type your message > ',
        validate: function(value) {
          if (value.trim()) {
            return true;
          }
          return 'Please enter a non empty message';
        }
      }];

      inquirer.prompt(questions).then(function(answers) {
        // console.log(JSON.stringify(answers, null, '  '));
        options.text = answers.message;
        resolve(answers);
      });
    });
  }
}
