const gulp=require('gulp');
const html=require('gulp-minify-html');
const css=require('gulp-minify-css');
const sass=require('gulp-sass');
const uglifyjs = require('gulp-uglify'); //引入js压缩模块
const watch = require('gulp-watch'); //引入监听模块
const browserify = require('browserify');//让浏览器支持require
const source = require('vinyl-source-stream');//文件流
const babel = require('gulp-babel'); //es6转es5主要模块
const bablecore = require('babel-core'); //es6转es5主要模块
const es2015 = require('babel-preset-es2015'); //es6转es5主要模块
const imagemin = require('gulp-imagemin'); //引入图片压缩模块
const sourcemaps = require('gulp-sourcemaps');
const plugins=require('gulp-load-plugins')();

gulp.task('copyfile',function(){
    return gulp.src('src/font/*')
    .pipe(gulp.dest('dist/font/'));
});

gulp.task('uglifyhtml',function(){
    return gulp.src('src/*.html')
    .pipe(html())
    .pipe(gulp.dest('dist/'));
});

// gulp.task('uglifycss',function(){
//     return gulp.src('src/css/*.css')
//     .pipe(css())
//     .pipe(gulp.dest('dist/css/'));
// });

gulp.task('compilesass',function(){
    return gulp.src('src/sass/*.scss')
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.sass({
        outputStyle:'compressed'
    }))
    .pipe(plugins.sourcemaps.write('.'))
    .pipe(gulp.dest('dist/css/'));
});

gulp.task('babel',function(){
    return gulp.src('src/script/*.js')
    .pipe(babel({
        presets:['es2015']
    }))
    .pipe(uglifyjs())
    .pipe(gulp.dest('dist/js'));
});

gulp.task('runimg', function () {
    return gulp.src('src/img/*.{png,gif,jpg,ico}')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/img/'));
});

gulp.task("browserify", function () {
    var b = browserify({
        entries: "dist/js/usemodule.js"//入口文件
    });

    return b.bundle()
        .pipe(source("main.js"))//编译后的入口文件
        .pipe(gulp.dest("dist/js"));//输出路径
});

gulp.task('default',function(){
    watch(['src/font/*','src/*.html','src/sass/*.scss','src/script/*.js','src/img/*.{png,jpg,gif,ico}'],gulp.parallel('copyfile','uglifyhtml','compilesass','babel','runimg','browserify'));
});