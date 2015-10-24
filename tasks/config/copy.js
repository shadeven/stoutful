/**
 * Copy files and folders.
 *
 * ---------------------------------------------------------------
 *
 * # dev task config
 * Copies all directories and files, exept coffescript and less fiels, from the sails
 * assets folder into the .tmp/public directory.
 *
 * # build task config
 * Copies all directories nd files from the .tmp/public directory into a www directory.
 *
 * For usage docs see:
 * 		https://github.com/gruntjs/grunt-contrib-copy
 */
module.exports = function(grunt) {
  grunt.config.set('copy', {
    dev: {
      files: [{
        expand: true,
        cwd: './assets',
        src: ['**/*.!(coffee|less|scss|sass)', '!js/controllers/**'],
        dest: '.tmp/public'
      }, {
        expand: true,
        cwd: './bower_components',
        src: ['ladda/dist/ladda.min.css', 'bootstrap/dist/css/bootstrap.css'],
        flatten: true,
        dest: '.tmp/public/styles/vendor'
      }, {
        expand: true,
        cwd: './bower_components',
        src: ['bootstrap/fonts/glyphicons-halflings-regular.*'],
        flatten: true,
        dest: '.tmp/public/styles/fonts'
      }]
    },
    build: {
      files: [{
        expand: true,
        cwd: '.tmp/public',
        src: ['**/*'],
        dest: 'www'
      }]
    }
  });

  grunt.loadNpmTasks('grunt-contrib-copy');
};
