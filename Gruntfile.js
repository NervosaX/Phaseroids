/*global module*/
module.exports = function (grunt) {
    'use strict';

    // Show elapsed time at the end
    require('time-grunt')(grunt);

    // Load all grunt tasks
    require('load-grunt-tasks')(grunt);

    var target = grunt.option('target') || 'dev';
    var _ = grunt.util._;

    grunt.initConfig({
        config: {
            app: 'src/',
            dist: 'dist/'
        },

        // r.js Optimization. Requires a config from <%= config.app %>js/main.js
        // returned using module.exports = ...
        requirejs: {
            production: {
                options: {
                    findNestedDependencies: true,
                    mainConfigFile: '<%= config.app %>js/main.js',
                    baseUrl: '<%= config.app %>js',
                    name: 'main',
                    out: '<%= config.dist %>js/main.js',
                    // optimize: 'uglify2',
                }
            }
        },

        // Converts sass to css
        sass: {
            production: {
                options: {
                    style: 'compressed'
                },
                files: {
                    '<%= config.dist %>css/core.css': '<%= config.app %>css/core.scss'
                }
            },
            dev: {
                options: {
                    style: 'expanded'
                },
                files: {
                    '<%= config.dist %>css/core.css': '<%= config.app %>css/core.scss'
                }
            }
        },

        // Copies files from src to www
        copy: {
            // Production copies only compiled files and required libs
            production: {
                files: [{
                    cwd: "<%= config.app %>",
                    src: '**/*.{html,png,jpg,css,ttf,svg,woff}',
                    dest: "<%= config.dist %>",
                    filter: 'isFile',
                    expand: true
                }, {
                    src: '<%= config.app %>js/libs/require.js',
                    dest: '<%= config.dist %>js/libs/require.js',
                }]
            },
            // Development copies all files, apart from compiled files
            // like sass.
            dev: {
                files: [{
                    cwd: "<%= config.app %>",
                    src: '{!**/*.scss,**}',
                    dest: "<%= config.dist %>",
                    expand: true
                }]
            },
            // Used for development file changes during watch
            change: {
                files: [{
                    src: ['<%= config.app %>**'],
                    dest: '<%= config.dist %>',
                    expand: true
                }]
            }
        },

        // JS hints for all non lib file warnings (or errors)
        jshint: {
            options: {
                ignores: ['./<%= config.app %>**/libs/**/*.js'],
                force: true
            },
            main: ['./<%= config.app %>**/*.js']
        },

        // Cleans www folder before any process
        clean: ['{!<%= config.dist %>.empty,<%= config.dist %>*}'],

        // Used to watch for file changes.
        // Will automatically be added by grunt
        watch: {
            options: {
                livereload: 35728,
                spawn: false
            },
            // Compile sass on sass changes
            sass: {
                files: ['./<%= config.app %>**/*.scss'],
                tasks: ['sass:' + target],
            },
            // Check for javascript errors on js changes
            js: {
                files: ['./<%= config.app %>**/*.js'],
                tasks: ['jshint']
            },
            templates: {
                files: ['./<%= config.app %>**/*.html'],
                tasks: []
            }
        },
        connect: {
            server: {
                options: {
                    port: 3000,
                    base: '<%= config.dist %>',
                    // keepalive: true,
                    livereload: 35728,
                    hostname: '*'
                }
            }
        },
        concurrent: {
            server: [
                'copy:dev',
                // 'sass:dev',
            ]
        }
    })

    grunt.event.on('watch', function(action, filepath, target) {
        grunt.log.writeln(target + ': ' + filepath + ' has ' + action);

        if (target === 'js' || target === 'templates') {
            // Copy over just the file you save
            var _path = filepath.replace('src/', '');
            console.log(_path);
            grunt.config.set('copy', {
                changed: {
                    cwd: '<%= config.app %>',
                    expand: true,
                    src: [_path],
                    dest: '<%= config.dist %>'
                }
            });
            grunt.task.run('copy:changed');

            if (target === 'js')
                grunt.config(['jshint', 'main'], filepath);
        }
    });

    grunt.registerTask('build', function() {

        grunt.task.run('clean');

        if (target === 'dev') {
            grunt.task.run('jshint');
        } else {
            grunt.task.run('requirejs');
        }

        grunt.task.run([
            'copy:' + target
        ]);
    });

    grunt.registerTask('server', function() {
        grunt.task.run([
            'clean',
            'concurrent:server',
            'connect:server',
            'watch',
        ]);
    });

    grunt.registerTask('default', function() {
        grunt.task.run('server');
    });
};