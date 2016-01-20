module.exports = function(grunt){

  grunt.loadNpmTasks('grunt-contrib-sass');

  grunt.registerTask("default", ["sass"]);

  grunt.initConfig({
    sass: {
      dist: {
        files: {
          './css/style.css' : './css/style.scss'
        }
      }
    }
  });
};
