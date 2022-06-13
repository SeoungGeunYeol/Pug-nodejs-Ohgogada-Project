import gulp from "gulp";
import gpug from "gulp-pug";
import del from "del";
import autoprefixer from "gulp-autoprefixer";
import miniCSS from "gulp-csso";

const sass = require("gulp-sass")(require("node-sass"));

const routes = {
  pug: {
    watch: "src/views/**/*.pug",
    src: "src/views/*.pug",
    dest: "build",
  },
  scss: {
    watch: "src/client/**/*.scss",
    src: "src/client/scss/styles.scss",
    dest: "build/css",
  },
};

const pug = () =>
  gulp.src(routes.pug.src).pipe(gpug()).pipe(gulp.dest(routes.pug.dest));

const clean = () => del(["build/"]);

const styles = () =>
  gulp
    .src(routes.scss.src)
    .pipe(sass().on("error", sass.logError))
    .pipe(autoprefixer())
    .pipe(miniCSS())
    .pipe(gulp.dest(routes.scss.dest));

const watch = () => {
  gulp.watch(routes.pug.watch, pug);
  gulp.watch(routes.scss.watch, styles);
};

const prepare = gulp.series([clean]);

const assets = gulp.series([pug, styles]);

const live = gulp.series([watch]);

export const build = gulp.series([prepare, assets]);

export const dev = gulp.series([build, live]);

export const deploy = gulp.series([build, clean]);
