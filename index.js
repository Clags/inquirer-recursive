var _ = require("lodash");
var util = require("util");
var inquirer = require("inquirer");
var ScreenManager = require('inquirer/lib/utils/screen-manager');
var Base = require("inquirer/lib/prompts/base");

module.exports = Prompt;

function Prompt(question, rl, answers) {
  // Set defaults prompt options
  this.screen = new ScreenManager(rl);

  this.opt = _.defaults(_.clone(question), {
    validate: function () {
      return true;
    },
    filter: function (val) {
      return val;
    },
    when: function () {
      return true;
    }
  });
  this.answers = {...answers};
  this.responses = [];
  return this;
}


util.inherits(Prompt, Base);

Prompt.prototype.askForLoop = function () {
  var ui = inquirer.prompt({
    default: true,
    type: 'confirm',
    name: 'loop',
    message: (typeof this.opt.message === 'function' ? this.opt.message() : this.opt.message) || 'Would you like to loop ?'
  },this.answers).then(function (result) {
    if (result.loop) {
      this.askNestedQuestion();
    } else {
      this.done(this.responses);
    }
  }.bind(this));
}

Prompt.prototype.askNestedQuestion = function () {
  inquirer.prompt(this.opt.prompts, this.answers).then(function (result) {
    this.responses.push(result);
    this.askForLoop();
  }.bind(this));
}


Prompt.prototype._run = function (cb) {
  this.done = cb;
  this.askForLoop();
  return this;
};
