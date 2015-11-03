'use strict';

module.exports = function (grunt) {
    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // Automatically load required Grunt tasks
    require('jit-grunt')(grunt);

    // Configurable paths for the application
    var appConfig = {
        app: require('./bower.json').appPath || 'app',
        dist: 'dist'
    };

    // Define the configuration for all the tasks
    grunt.initConfig({

        // Project settings
        tiger: appConfig,

        // Watches files for changes and runs tasks based on the changed files
        watch: {
            less: {
                files: ['<%= tiger.app %>/less/**/*.less'],
                tasks: ['less']
            },
            concat: {
                files: ['<%= tiger.app %>/scripts/directives/**/*.js', '<%= tiger.app %>/scripts/services/**/*.js'],
                tasks: ['concat:serve']
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '<%= tiger.app %>/index.html',
                    '<%= tiger.app %>/tpl/**/*.html',
                    '<%= tiger.app %>/scripts/**/*.js',
                    '<%= tiger.app %>/styles/**/*.css',
                    '<%= tiger.app %>/images/**/*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            }
        },

        // The actual grunt server settings
        connect: {
            options: {
                port: 9002,
                // Change this to '0.0.0.0' to access the server from outside.
                hostname: 'localhost',
                livereload: 35730
            },
            livereload: {
                options: {
                    open: true,
                    middleware: function (connect) {
                        return [
                            connect().use(
                                '/bower_components',
                                connect.static('./<%= tiger.app %>/bower_components')
                            ),
                            connect().use(
                                '/<%= tiger.app %>/styles',
                                connect.static('./<%= tiger.app %>/styles')
                            ),
                            connect.static(appConfig.app)
                        ];
                    }
                }
            }
        },

        // Compile less files
        less: {
            serve: {
                files: {
                    '<%= tiger.app %>/styles/tiger-ui.css': '<%= tiger.app %>/less/tiger-ui.less'
                }
            }
        },

        clean: {
            dist: {
                files: [
                    {
                        dot: true,
                        src: [
                            '<%= tiger.dist %>/**/*',
                        ]
                    }
                ]
            }
        },

        copy: {
            dist: {
                files: [
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= tiger.app %>',
                        dest: '<%= tiger.dist %>',
                        src: [
                            'styles/**/*.css'
                        ]
                    },
                    {
                        expand: true,
                        dot: true,
                        cwd: '.tmp',
                        dest: '<%= tiger.dist %>',
                        src: [
                            'scripts/**/*.js'
                        ]
                    }
                ]
            }
        },

        concat: {
            options: {
                separator: '\n\n'
            },
            serve: {
                src: [
                    '<%= tiger.app %>/scripts/services/**/*.js',
                    '<%= tiger.app %>/scripts/directives/**/*.js'
                ],
                dest: '.tmp/scripts/tiger-ui.js'
            }
        }
    });

    grunt.registerTask('serve', 'Compile then start a connect web server', function () {
        grunt.task.run([
            'connect:livereload',
            'watch'
        ]);
    });

    grunt.registerTask('dist', function () {
        grunt.task.run([
            'clean:dist',
            'less',
            'concat:serve',
            'copy:dist'
        ]);
    });
};
