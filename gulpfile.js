//Remember to work on autoRefresh

const gulp = require('gulp');
const babel = require('gulp-babel');
const jshint = require('gulp-jshint');
const uglify = require('gulp-uglify');
const watch = require('gulp-watch');
const browserSync =  require('browser-sync').create();
const runSequence = require('run-sequence');

function reload(done) {
    browserSync.reload();
    done();
  }

gulp.task('processHTML', (callback) => {
    gulp.src('*.html')
        .pipe(gulp.dest('dist'));
    callback();
});


gulp.task('processJS', (callback) => {
    gulp.src('scripts.js')
        .pipe(jshint({
            //use es8
            esversion: 8
        }))
        .pipe(jshint.reporter('jshint-stylish'))        //use stylish reporting style
        .pipe(babel({
            presets: ['@babel/preset-env']      //This is for babel 7
        }))
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
        callback();
});

gulp.task('babelPolyfill', (callback) => {
    gulp.src('node_modules/babel-polyfill/browser.js')
        .pipe(gulp.dest('dist/node_modules/babel-polyfill'));
        callback();
});

gulp.task('browserSync', (callback) => {
    browserSync.init({
        server: './dist',
        port: 8080,
        ui: {
            port: 8081
        }
    });
    callback();
});

gulp.task('watch',gulp.parallel('browserSync',() => {
    gulp.watch('scripts.js',gulp.series('processJS'));
    gulp.watch('index.html',gulp.series('processHTML'));

    gulp.watch('dist/*.js', reload);
    gulp.watch('dist/*.html', reload);
}));

// gulp.task('default',(callback) => {
//     runSequence(['processHTML','processJS','babelPolyfill'],callback);
// });



gulp.task('default',gulp.series('processHTML','processJS','babelPolyfill',gulp.parallel('watch')));
