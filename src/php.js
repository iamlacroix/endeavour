import chalk from "chalk";
import connect from "gulp-connect-php";

const TAG = "[php]";

export default function startPhp (cb = ()=>true) {
  console.log(TAG, chalk.blue("Starting PHP server..."));

  connect.server({
    port: CONFIG.PHP.PORT,
    keepalive: true,
    hostname: CONFIG.PHP.HOST,
    base: "public",
  }, cb);
}
