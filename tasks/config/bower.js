module.exports = function(grunt) {
  grunt.config.set('bower_concat', {
    dev: {
      dest: '.tmp/public/js/vendor.js'
    }
  });
  grunt.loadNpmTasks('grunt-bower-concat');
};
