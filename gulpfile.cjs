"use strict";

const gulp = require("gulp");
const build = require("@microsoft/sp-build-web");
const { spawn } = require("child_process");

// Initialize SPFx + Heft pipeline
build.initialize(gulp);

// Run Heft build
gulp.task("heft", (done) => {
  const heft = spawn("npx", ["heft", "build"], { stdio: "inherit" });
  heft.on("close", (code) => {
    if (code !== 0) process.exit(code);
    done();
  });
});

// Run Heft clean
gulp.task("clean", (done) => {
  const heft = spawn("npx", ["heft", "clean"], { stdio: "inherit" });
  heft.on("close", (code) => {
    if (code !== 0) process.exit(code);
    done();
  });
});

// Default task
gulp.task("default", gulp.series("clean", "heft"));
