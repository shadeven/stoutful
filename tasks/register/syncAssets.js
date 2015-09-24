module.exports = function (grunt) {
  grunt.registerTask('syncAssets', [
    'jst:dev',
    'less:dev',
    'sass:dev',
    'bower_concat:dev',
    'concat:controllers',
    'sync:dev',
    'coffee:dev'
  ]);
};
