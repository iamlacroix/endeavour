import chalk from "chalk";
import BrowserSync from "browser-sync";
import htmlInjector from "bs-html-injector";

import startPhp from "./php";

const TAG = "[browsersync]";

let browserSync = BrowserSync.create();

// Init the PHP server, followed by BrowserSync
let start = (cb = ()=>true) => {

  browserSync.use(htmlInjector, {
    files: [
      "templates/**/*.twig",
    ],
  });

  let bsOpts = {
    port: CONFIG.BS.PORT,
    proxy: CONFIG.BS.PROXY,
    logConnections: true,
    open: false,
    files: CONFIG.BS.FILES,
  };

  startPhp(() => {
    console.log(TAG, chalk.blue("Starting BrowserSync..."));
    browserSync.init(bsOpts, cb);
  });

};

export default { browserSync, start };
