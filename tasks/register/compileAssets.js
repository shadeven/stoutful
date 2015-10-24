module.exports = function (grunt) {
  grunt.registerTask('compileAssets', [
    'clean:dev',
    'jst:dev',
    'less:dev',
    'sass:dev',
    'bower_concat:dev',
    'concat:controllers',
    'copy:dev',
    'coffee:dev'
  ]);
};
