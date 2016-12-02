//getting our gulp parts
const gulp = require('gulp'),
   nodemon = require('gulp-nodemon')

//Default is just build
gulp.task('default', function() {

})

//Starts the express server
gulp.task('start', function() {
  nodemon({
    script: 'app.js'
  , ext: 'js html'
  , env: { 'NODE_ENV': 'development' }
  })
})
