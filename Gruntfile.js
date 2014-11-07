// Gruntfile.js

// our wrapper function (required by grunt and its plugins)
// all configuration goes inside this function
module.exports = function (grunt) {
    'use strict';

    // ===========================================================================
    // CONFIGURE GRUNT ===========================================================
    // ===========================================================================
    //noinspection JSHint
    grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),
    markdown: {
      all: {
        files: [{
          expand: true,
          src: './*.md',
          dest: 'html/',
          ext: '.html'
        }]
      }
    },
        markdownpdf: {
           options: {},
    		files: {
      			src: "restful-standards.md",
      			dest: "./pdf"
    		}
  	},
        doctoc: {
            options: {
                bitbucket: false
            },
            restful: {
                options : {
                    target: "./restful-standards.md",
                    header: "\n# Yet Another RESTful API Standard (YARAS) - Introduction\n  YARAS provides standards, guidelines and conventions for writing a RESTful API and is intended to encourage consistency, maintainability, and consistent use of best practices.\n\n## Table of Contents"
                }
            }
        }
    });

    require('load-grunt-tasks')(grunt);

    var doctoc = function () {
        grunt.task.run(['doctoc']);
    };

    grunt.registerTask('toc', '', doctoc);
    grunt.registerTask('html', ['doctoc', 'markdown:all']);
    grunt.registerTask('pdf', ['doctoc', 'markdownpdf']);
    grunt.registerTask('default', '', doctoc);
};
