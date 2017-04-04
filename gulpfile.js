var gulp = require('gulp');
var del = require("del");
var sass = require("gulp-sass");
var uglify = require("gulp-uglify");
var webserver = require('gulp-webserver');


gulp.task("compile", function(){
  return gulp.src("public/assets/css/*.scss")
             .pipe(sass().on("error", sass.logError))
             .pipe(gulp.dest("build/assets/css/"))
})

gulp.task("compress", function(){
  gulp.src("public/**/*.js")
      .pipe(uglify())
      .pipe(gulp.dest("build"))
})

gulp.task("clean", function(cb){
  del(["build"], cb)
})

gulp.task('build', ["compile"], function(){
  return gulp.src(["public/**/*", "!public/**/*.scss"])
             .pipe(gulp.dest("build"))
})

gulp.task("watch", function(){
  gulp.watch(["public/**/*.scss"], ["compile"]).on("change", function(e){
    console.log("SASS file " + e.path + " has been compiled !")
  })
})

gulp.task('serve', function(){
  gulp.src('build')
    .pipe(webserver({
      livereload: true,
      directoryListing: false,
      open: true,
      port: 3000
    }))
})

gulp.task("start", ["watch", "serve"])