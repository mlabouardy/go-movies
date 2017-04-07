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
var series = require("stream-series");
var gulpsync = require("gulp-sync")(gulp);

var input = {
  sass : 'public/assets/scss/**/*.scss',
  javascript : 'public/app/**/*.js',
  html : 'public/**/*.html',
  bower : 'public/lib/*'
}

var output = {
  css : 'test/assets/css',
  javascript : 'test/assets/javascript',
  build: 'test'
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
             .pipe(gulp.dest(output.javascript))
});

gulp.task("build-html", function(){
  return gulp.src(["!public/lib/**/*.html", "public/**/*.html"])
             .pipe(gulp.dest(output.build))
});

gulp.task("build-bower-css", function(){
  return gulp.src(mainBowerFiles("**/*.css", {
              paths: {
                bowerDirectory: "public/lib",
                bowerrc: "public/.bowerrrc",
                bowerJson: "public/bower.json"
              }
            }))
            .pipe(concat("master.css"))
            .pipe(gulp.dest(output.css))
})

gulp.task("build-bower-js", function(){
  return gulp.src(mainBowerFiles("**/*.js", {
                paths:{
                  bowerDirectory: 'public/lib',
                  bowerrc: 'public/.bowerrc',
                  bowerJson: 'public/bower.json'
                }
              }))
             .pipe(concat("vendor.js"))
             .pipe(gulp.dest(output.javascript))
})

gulp.task("inject", function(){
  var sources = gulp.src([output.javascript+"/bundle.js", output.css+"/default.css"], {read:false})
  var vendor = gulp.src([output.javascript+"/vendor.js", output.css+"/master.css"], {read: false})
  return gulp.src(output.build + "/index.html")
            .pipe(inject(series(vendor, sources), {ignorePath: output.build}))
            .pipe(gulp.dest(output.build))
})

gulp.task("watch", function(){
  gulp.watch([input.sass], ["build-css"]).on("change", function(e){
    console.log("SASS file " + e.path + " has been compiled !")
  })

  gulp.watch([input.javascript], gulpsync.sync(["jshint", "build-js"])).on("change", function(e){
    console.log("Running jshint analyser on " + e.path)
    console.log("Building JS file " + e.path)
  })

  gulp.watch([input.html], gulpsync.sync(["build-html", "inject"])).on("change", function(e){
    console.log("Building html file " + e.path)
  })

  gulp.watch([input.bower], gulpsync.sync(["build-bower-js", "build-bower-css"])).on("change", function(e){
    console.log("Injecting " + e.path)
  })
})

gulp.task("build", gulpsync.sync(["build-html", "build-css", "build-bower-css", "build-bower-js", "build-js", "inject"]))

gulp.task('serve', function(){
  gulp.src(output.build)
    .pipe(webserver({
      livereload: true,
      directoryListing: false,
      open: true,
      port: 3000
    }))
})
