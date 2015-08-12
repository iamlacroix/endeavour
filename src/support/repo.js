import chalk from "chalk";
import NodeGit from "nodegit";
import inquirer from "inquirer";

const TAG = "[repo]";

let promptIfDirty = (cb) => {
  NodeGit.Repository.open(".").then(function (repo) {

    return repo.getStatus();

  }).then(function (status) {

    if (status.length > 0) {
      // Dirty tree, verify deployment
      let msg = chalk.white.bgMagenta("Local changes detected!") +
                " Uncommited changes will be deployed.";
      let question = "Would you like to proceed anyway?";
      console.log(msg);
      inquirer.prompt([{
        type: "confirm",
        name: "deploy",
        message: question,
        default: false,
      }], function (answers) {
        if (answers.deploy) {
          cb();
        } else {
          console.log(TAG, chalk.red("Cancelling deployment..."));
          process.exit();
        }
      });
    } else {
      // Clean tree, proceed automatically
      cb();
    }

  }).catch(function (err) {

    throw new Error(err);

  });
};

export default { promptIfDirty };
