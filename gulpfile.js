var gulp = require('gulp');
var del = require("del");
var sass = require("gulp-sass");
var inject= require("gulp-inject");
var uglify = require("gulp-uglify");
var jshint = require("gulp-jshint");
var sourcemaps = require("gulp-sourcemaps");
var concat = require("gulp-concat");
var webserver = require('gulp-webserver');


gulp.task("clean", function(cb){
  del(["build"], cb)
})

gulp.task('jshint', function(){
  return gulp.src("public/app/**/*.js")
             .pipe(jshint())
             .pipe(jshint.reporter('jshint-stylish'))
})

gulp.task("build-css", function(){
  return gulp.src("public/assets/scss/*.scss")
             .pipe(sass().on("error", sass.logError))
             .pipe(gulp.dest("build/assets/css"))
})

gulp.task("build-js", function(){
  return gulp.src("public/app/**/*.js")
             .pipe(sourcemaps.init())
             .pipe(concat("bundle.js"))
             .pipe(uglify())
             .pipe(sourcemaps.write())
             .pipe(gulp.dest("build/assets/javascript"))
});

gulp.task("build-html", function(){
  return gulp.src(["public/**/*.html"])
             .pipe(gulp.dest("build"))
});

gulp.task("build-plugins", function(){
  return gulp.src(["public/lib/*"])
             .pipe(gulp.dest("build/lib"))
})

gulp.task("inject", function(){
  var sources = gulp.src(["build/assets/**/*.js", "build/assets/**/*.css"], {read:false})
  return gulp.src("build/index.html")
            .pipe(inject(sources, {ignorePath:'build'}))
            .pipe(gulp.dest("build"))
})

gulp.task("watch", function(){
  gulp.watch(["public/**/*.scss"], ["build-css"]).on("change", function(e){
    console.log("SASS file " + e.path + " has been compiled !")
  })

  gulp.watch(["public/app/**/*.js"], ["jshint", "build-js"]).on("change", function(e){
    console.log("Running jshint analyser on " + e.path)
    console.log("Building JS file " + e.path)
  })

  gulp.watch(["public/app/**/*.html"], ["build-html"]).on("change", function(e){
    console.log("Building html file " + e.path)
  })
})

gulp.task("build", ["build-html", "build-css", "build-js", "build-plugins", "inject"])

gulp.task('serve', function(){
  gulp.src('build')
    .pipe(webserver({
      livereload: true,
      directoryListing: false,
      open: true,
      port: 3000
    }))
})
