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
        }
    });

    grunt.registerTask('serve', 'Compile then start a connect web server', function () {
        grunt.task.run([
            'connect:livereload',
            'watch'
        ]);
    });
};