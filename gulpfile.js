var gulp = require('gulp');
var open = require('gulp-open');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var connect = require('gulp-connect');
var streamify = require('gulp-streamify');
var htmlreplace = require('gulp-html-replace');

var watchify = require('watchify');
var babelify = require('babelify');
var browserify = require('browserify');

var source = require('vinyl-source-stream');

var argv = require('yargs').argv;


/** Local development server information */
var config = {
  // USAGE: gulp --port <number>
  PORT: argv.port ? argv.port : 9055,
  URL: 'http://localhost'
};


/** All the paths */
var path = {
  HTML: 'src/index.html',
  MINIFIED_OUT: 'build.min.js',
  OUT: 'build.js',
  DEST: 'dist',
  DEST_BUILD: 'dist/build',
  DEST_SRC: 'dist/src',
  ENTRY_POINT: './src/main.js',
  CSS: [
    'node_modules/bootstrap/dist/css/bootstrap.min.css',
    './src/**/*.css'
  ]
};

// Independent of development and production //


/** Creates a local dev server */
gulp.task('connect', function connectToServer() {
  connect.server({
    root: ['dist'],
    port: config.PORT,
    base: config.URL,
    livereload: true
  });
});


/** Open the index html file. It also dependes on connect task.*/
gulp.task('open', ['connect'], function openTask() {
  gulp.src('dist/index.html')
  .pipe(open({
    uri: config.URL + ':' + config.PORT + '/'
  }));
});


// bundle all css to /css/bundle.css
gulp.task('css', function bundleCSS() {
  gulp.src(path.CSS)
  .pipe(concat('bundle.css'))
  .pipe(gulp.dest(path.DEST + '/css'));
});


// Development Tasks //

/** Take index.html page and copy it over to dist folder. */
gulp.task('copy', function() {
  gulp.src(path.HTML)
  .pipe(gulp.dest(path.DEST));
});


/** Bundle all js to /scripts/build.js also show the source-maps */
gulp.task('watch', ['copy'], function() {
  gulp.watch(path.HTML, ['copy']);
  gulp.watch(path.CSS, ['css']);

  var watcher = watchify(browserify({
    entries: [path.ENTRY_POINT],
    transform: [[babelify, {presets: ['es2015', 'react', 'stage-0'] } ]],
    debug: true,
    cache: {}, packageCache: {}, fullPaths: true
  }));

  return watcher.on('update', function() {
    watcher.bundle()
    .pipe(source(path.OUT))
    .pipe(gulp.dest(path.DEST_SRC));
    console.log('Updated');
  })
  .bundle()
  .on('error', console.error.bind(console))
  .pipe(source(path.OUT))
  .pipe(gulp.dest(path.DEST_SRC));
});


gulp.task('default', ['watch', 'css', 'open']);


// Production Tasks //

/** bundle all js to /scripts/build.min.js */
gulp.task('build', function() {
  browserify({
    entries: [path.ENTRY_POINT],
    transform: [[babelify, {presets: ['es2015', 'react', 'stage-0'] } ]]
  })
  .bundle()
  .pipe(source(path.MINIFIED_OUT))
  .pipe(streamify(uglify()))
  .pipe(gulp.dest(path.DEST_BUILD));
});

/** replaces script tags on the index.html file to point to single minified
* javascript file
*/
gulp.task('replaceHTML', function() {
  gulp.src(path.HTML)
  .pipe(htmlreplace({
    'js': 'build/' + path.MINIFIED_OUT
  }))
  .pipe(gulp.dest(path.DEST));
});


// Runs the required tasks to setup the production code
gulp.task('production', ['css', 'replaceHTML', 'build']);
