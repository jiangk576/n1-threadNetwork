'use strict';

var conf = require('./conf'),
    connect = require('gulp-connect'),
    gulp = require('gulp'),
    proxy = require('http-proxy-middleware');

gulp.task('connect', function() {
    connect.server({
        livereload: true,
        root: conf.paths.docs,
        middleware: function(connect, opt) {
           return [
                proxy('/api',  {
                    target: '127.0.0.1:3006',
                    changeOrigin:true
               })
           ]
       }
    });
});
