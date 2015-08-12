import webpack from "webpack";
import rimraf from "rimraf";
import chalk from "chalk";
import notifier from "node-notifier";

const TAG = "[webpack]";

export default function execWebpack (config, cb) {
  let notifyOrThrowError = (errors) => {
    let msg = chalk.red(errors);

    notifier.notify({
      "title": "webpack",
      "subtitle": "Build Error",
      "message": errors,
      "sound": "Pop",
    });

    if (!config.watch) throw new Error("execWebpack: " + msg);
  };

  console.log(TAG, chalk.blue("Building assets..."));

  // Remove build directory
  rimraf.sync(config.output.path);

  // Run webpack
  webpack(config, function (err, stats) {
    if (err) {
      notifyOrThrowError(err);
    }

    let jsonStats = stats.toJson();

    if (jsonStats.errors.length > 0) {
      notifyOrThrowError(jsonStats.errors.toString());
    }

    let msg = stats.toString({
      colors: true,
      version: false,
      chunks: false,
    });
    console.log(TAG, msg, "\n");

    if (cb) cb();
  });
}
