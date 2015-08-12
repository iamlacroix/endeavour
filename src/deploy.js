import chalk from "chalk";
import {rsync} from "rsyncwrapper";

import repo from "./support/repo";
import build from "./build";

const TAG = "[deploy]";

let ensureSshString = (sshString) => {
  if (!sshString) {
    throw new Error("[deploy] Error: SSH string is required");
  }
};

/**
 * Sync to remote server
 *
 * rsync -azP \
 *   --delete \
 *   --include="public/assets/" \
 *   --exclude=".*" \
 *   --exclude="node_modules/" \
 *   --exclude="craft/storage/*" \
 *   --exclude="config/license.key" \
 *   --exclude="public/content/docs/*" \
 *   --exclude="public/content/images/*" \
 *   --exclude="assets/" \
 *   ./ username@domain.tld:~/domain.tld
**/

let sync = (sshUserHostDest, cb = ()=>true) => {

  console.log(TAG, "Starting deployment to",
              chalk.blue.bold(sshUserHostDest));

  ensureSshString(sshUserHostDest);

  // Sync
  rsync({
    sshUserHostDest: true,
    src: "./",
    dest: sshUserHostDest,
    delete: true,
    args: ["-azP"],
    include: CONFIG.DEPLOY.INCLUDE,
    exclude: CONFIG.DEPLOY.EXCLUDE,
    // dryRun: true,
  }, function (error, stdout) {

    // Args: error, stdout, stderr, cmd
    if (error) throw new Error(error.message);

    // Success
    console.log(stdout);
    console.log(TAG, chalk.green.bold("Deployed to"),
                chalk.magenta(sshUserHostDest));
    cb();
  });
};

let buildAndSync = (config, sshUserHostDest, cb = ()=>true) => {
  ensureSshString(sshUserHostDest);

  repo.promptIfDirty(() => {
    build(config, () => {
      sync(sshUserHostDest, cb);
    });
  });
};

export default { sync, buildAndSync };
