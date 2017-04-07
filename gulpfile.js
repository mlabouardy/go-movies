var gulp = require('gulp');
var del = require("del");
var sass = require("gulp-sass");
var inject= require("gulp-inject");
var uglify = require("gulp-uglify");
var jshint = require("gulp-jshint");
var sourcemaps = require("gulp-sourcemaps");
var concat = require("gulp-concat");
var webserver = require('gulp-webserver');
var plugins = require("gulp-load-plugins")
var mainBowerFiles = require("main-bower-files");

var input = {
  sass : 'public/assets/scss/**/*.scss',
  javascript : 'public/app/**/*.js',
  html : 'public/**/*.html'
}

var output = {
  css : 'build/assets/css',
  javascript : 'build/assets/javascript',
  build: 'build'
}


gulp.task("clean", function(cb){
  del(["build"], cb)
})

gulp.task('jshint', function(){
  return gulp.src(input.javascript)
             .pipe(jshint())
             .pipe(jshint.reporter('jshint-stylish'))
})

gulp.task("build-css", function(){
  return gulp.src(input.sass)
             .pipe(sass().on("error", sass.logError))
             .pipe(gulp.dest(output.css))
})

gulp.task("build-js", function(){
  return gulp.src(input.javascript)
             .pipe(concat("bundle.js"))
             .pipe(uglify({
               mangle: false
             }))
             .pipe(gulp.dest(output.javascript))
});

gulp.task("build-html", function(){
  return gulp.src([input.html])
             .pipe(gulp.dest(output.build))
});

gulp.task("build-bower", function(){
  return gulp.src(mainBowerFiles({
                paths:{
                  bowerDirectory: 'public/lib',
                  bowerrc: 'public/.bowerrc',
                  bowerJson: 'public/bower.json'
                }
              }))
             .pipe(concat("vendor.js"))
             .pipe(uglify())
             .pipe(gulp.dest(output.javascript))
})

gulp.task("inject", function(){
  var sources = gulp.src([output.javascript+"/**/*.js", output.css+"/**/*.css"], {read:false})
  return gulp.src(output.build + "/index.html")
            .pipe(inject(sources, {ignorePath: output.build}))
            .pipe(gulp.dest(output.build))
})

gulp.task("watch", function(){
  gulp.watch([input.scss], ["build-css"]).on("change", function(e){
    console.log("SASS file " + e.path + " has been compiled !")
  })

  gulp.watch([input.javascript], ["jshint", "build-js"]).on("change", function(e){
    console.log("Running jshint analyser on " + e.path)
    console.log("Building JS file " + e.path)
  })

  gulp.watch([input.html], ["build-html"]).on("change", function(e){
    console.log("Building html file " + e.path)
  })
})

gulp.task("build", ["build-html", "build-css", "build-bower", "build-js", "inject"])

gulp.task('serve', function(){
  gulp.src('build')
    .pipe(webserver({
      livereload: true,
      directoryListing: false,
      open: true,
      port: 3000
    }))
})
