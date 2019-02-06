/*eslint-disable node/no-unpublished-require*/
const gulp = require('gulp');
const cssMin = require('gulp-css');
const autoprefixer = require('gulp-autoprefixer');
const cssnano = require('gulp-cssnano');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
/*eslint-enable node/no-unpublished-require*/

gulp.task('css', () => {
  return gulp
  .src('dev/css/**/*.css')
  .pipe(cssMin())
  .pipe(
    autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {
      cascade: true
    })
  )
  .pipe(cssnano())
  .pipe(gulp.dest('public/stylesheets'));
});

gulp.task('up-button', () => {
    return gulp
    .src("dev/js/up-button.js")
    .pipe(uglify())
    .pipe(gulp.dest('public/javascripts'));
});

gulp.task('registration', () => {
  return gulp
  .src('dev/js/registration-validation.js')
  .pipe(uglify())
  .pipe(gulp.dest('public/javascripts'));
});

gulp.task('authorization', () => {
  return gulp
  .src('dev/js/authorization-validation.js')
  .pipe(uglify())
  .pipe(gulp.dest('public/javascripts'));
});

gulp.task('post', () => {
  return gulp
  .src(['node_modules/medium-editor/dist/js/medium-editor.min.js',
        'dev/js/post.js'])
  .pipe(concat('post.js'))
  .pipe(gulp.dest('public/javascripts'));
});

gulp.task('editor-styles', () => {
  return gulp
  .src(['node_modules/medium-editor/dist/css/medium-editor.css',
        'node_modules/medium-editor/dist/css/themes/default.css'])
  .pipe(concat('editor-styles.css'))
  .pipe(gulp.dest('public/stylesheets'));
});

gulp.task('userAvatar', () => {
  return gulp
  .src('dev/js/userAvatar.js')
  .pipe(uglify())
  .pipe(gulp.dest('public/javascripts'));
});

gulp.task('comments', () => {
  return gulp
  .src('dev/js/comment.js')
  .pipe(uglify())
  .pipe(gulp.dest('public/javascripts'));
});

gulp.task('default', ['css',
                      'up-button',
                      'registration',
                      'authorization',
                      'post',
                      'editor-styles',
                      'userAvatar',
                      'comments'], () => {
  gulp.watch('dev/css/**/*.css', ['css']);
  gulp.watch('dev/js/up-button.js', ['up-button'])
  gulp.watch('dev/js/registration-validation.js', ['registration']);
  gulp.watch('dev/js/authorization-validation.js', ['authorization']);
  gulp.watch('dev/js/post.js', ['post']);
  gulp.watch('dev/js/userAvatar.js', ['userAvatar']);
  gulp.watch('dev/js/comment.js', ['comments']);
});
