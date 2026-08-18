"use strict";

const gulp = require("gulp");
const build = require("@microsoft/sp-build-web");

// Initialize default SPFx build pipeline
build.initialize(gulp);

// Example: Custom clean task
gulp.task("clean", (done) => {
  const del = require("del");
  del(["dist/**", "temp/**"]);
  done();
});

// Example: Copy static assets
gulp.task("copy-assets", () => {
  return gulp.src("./src/assets/**/*").pipe(gulp.dest("./dist/assets"));
});

// Example: Watch for changes
gulp.task("watch", () => {
  gulp.watch("./src/**/*.ts", gulp.series("build"));
  gulp.watch("./src/assets/**/*", gulp.series("copy-assets"));
});

// Example: Default task
gulp.task("default", gulp.series("clean", "copy-assets", "build"));
