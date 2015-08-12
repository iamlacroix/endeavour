import {exec} from "child_process";
import chalk from "chalk";

const TAG = "[db:pull]";

let generateSshCmd = ({user, password, host}) => {
  password = (password && password !== "") ? `:${password}` : "";

  // ssh user[:password]@host
  return `ssh ${user}${password}@${host}`;
};

let generateMysqlArgs = ({user, password, host, port, database}) => {
  password = (password) ? `-p${password}` : "";
  host = host || "localhost";
  port = port || "3306";

  // -u user -ppassword -h localhost -P 3306 db_name
  return `-u ${user} ${password} -h ${host} -P ${port} ${database}`;
};

let pull = ({ssh, remote, local, maxBuffer}, cb = ()=>true) => {

  maxBuffer = (maxBuffer && maxBuffer !== "") ? maxBuffer : 1024 * 1024 * 10;
  let sshCmd = generateSshCmd(ssh);
  let remoteArgs = generateMysqlArgs(remote);
  let localArgs = generateMysqlArgs(local);

  // ssh user[:password]@host "mysqldump ..." | mysql ...
  let cmd = `${sshCmd} "mysqldump ${remoteArgs}" | mysql ${localArgs}`;

  // Run shell command that pipes a remote mysqldump to a local mysql import
  exec(cmd, { maxBuffer: maxBuffer }, (error, stdout, stderr) => {
    console.log(stdout);

    if (error) throw new Error(TAG + " " + error);
    if (stderr) throw new Error(TAG + " " + stderr);

    console.log(TAG, chalk.green("Database has been synced"));

    cb();
  });

};

export default { pull };
