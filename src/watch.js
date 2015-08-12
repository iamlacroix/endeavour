import webpack from "./webpack";
import bs from "./browsersync";

let watch = (config) => {
  webpack(config, function() {
    if (!bs.browserSync.active) bs.start();
  });
}

export default watch;
