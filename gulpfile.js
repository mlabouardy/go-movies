var gulp = require('gulp');
var del = require("del");
var sass = require("gulp-sass");
var inject= require("gulp-inject");
var uglify = require("gulp-uglify");
var jshint = require("gulp-jshint");
var webserver = require('gulp-webserver');


gulp.task("clean", function(cb){
  del(["build"], cb)
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

gulp.task('jshint', function(){
  return gulp.src("public/app/**/*.js")
             .pipe(jshint())
             .pipe(jshint.reporter('jshint-stylish'))
})

gulp.task("compile", function(){
  return gulp.src("public/assets/css/*.scss")
             .pipe(sass().on("error", sass.logError))
             .pipe(gulp.dest("build/assets/css/"))
})

gulp.task("inject", function(){
  var sources = gulp.src(["build/app/**/*.js", "build/assets/**/*.css"], {read:false})
  return gulp.src("build/index.html")
            .pipe(inject(sources, {ignorePath:'build'}))
            .pipe(gulp.dest("build"))
})

gulp.task("compress", function(){
  gulp.src("public/**/*.js")
      .pipe(uglify())
      .pipe(gulp.dest("build"))
})


gulp.task('build', ["compile", "inject"], function(){
  return gulp.src(["public/**/*", "!public/**/*.scss"])
             .pipe(gulp.dest("build"))
})



gulp.task("watch", function(){
  gulp.watch(["public/**/*.scss"], ["compile"]).on("change", function(e){
    console.log("SASS file " + e.path + " has been compiled !")
  })

  gulp.watch(["public/app/**/*.js"], ["jshint"]).on("change", function(e){
    console.log("Running jshint analyser on " + e.path)
  })
})



gulp.task("start", ["watch", "serve"])
