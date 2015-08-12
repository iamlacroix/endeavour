import webpack from "./webpack";
import chalk from "chalk";

let build = (config, cb = ()=>true) => {
  webpack(config, function() {
    console.log( "[webpack]", chalk.magenta.bold("Assets compiled.") );
    cb();
  });
};

export default build;
