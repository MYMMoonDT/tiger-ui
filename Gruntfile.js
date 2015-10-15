'use strict';

module.exports = function (grunt) {
    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // Automatically load required Grunt tasks
    require('jit-grunt')(grunt, {
        ngtemplates: 'grunt-angular-templates'
    });

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
                port: 9001,
                // Change this to '0.0.0.0' to access the server from outside.
                hostname: 'localhost',
                livereload: 35729
            },
            livereload: {
                options: {
                    open: true,
                    middleware: function (connect) {
                        return [
                            connect().use(
                                '/bower_components',
                                connect.static('./bower_components')
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
            directives: {
                files: {
                    '<%= tiger.app %>/scripts/directives/tiger-router-tabs/tiger-router-tabs.css': '<%= tiger.app %>/less/directives/tiger-router-tabs.less'
                }
            },
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
                            '<%= tiger.dist %>/**/*'
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
                            'styles/**/*.css',
                            'scripts/directives/tiger-router-tabs/*.{css,js,html}',
                            'scripts/directives/tiger-datepicker/*.{css,js,html}'
                        ]
                    }
                ]

            }
        },

        cssmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= tiger.dist %>/styles',
                    src: ['*.css'],
                    dest: '<%= tiger.dist %>/styles',
                    ext: '.min.css'
                }]
            }
        },

        concat: {
            tigerRouterTabs: {
                src: [
                    '<%= tiger.dist %>/scripts/directives/tiger-router-tabs/tiger-router-tabs.js',
                    '<%= tiger.dist %>/scripts/directives/tiger-router-tabs/tiger-router-tabs-tpl.js'
                ],
                dest: '<%= tiger.dist %>/scripts/directives/tiger-router-tabs/tiger-router-tabs-min.js'
            },
            tigerDatePicker: {
                src: [
                    '<%= tiger.dist %>/scripts/directives/tiger-datepicker/tiger-datepicker.js',
                    '<%= tiger.dist %>/scripts/directives/tiger-datepicker/tiger-datepicker-tpl.js'
                ],
                dest: '<%= tiger.dist %>/scripts/directives/tiger-datepicker/tiger-datepicker-min.js'
            }
        },

        ngtemplates: {
            options: {
                module: 'tigerUI'
            },
            tigerRouterTabs: {
                options: {
                    url: function (url) {
                        return url.replace('dist\/', '');
                    }
                },
                src: '<%= tiger.dist %>/scripts/directives/tiger-router-tabs/*.html',
                dest: '<%= tiger.dist %>/scripts/directives/tiger-router-tabs/tiger-router-tabs-tpl.js'
            },
            tigerDatePicker: {
                options: {
                    url: function (url) {
                        return url.replace('dist\/', '');
                    }
                },
                src: '<%= tiger.dist %>/scripts/directives/tiger-datepicker/*.html',
                dest: '<%= tiger.dist %>/scripts/directives/tiger-datepicker/tiger-datepicker-tpl.js'
            }
        }
    });

    grunt.registerTask('serve', 'Compile then start a connect web server', function () {
        grunt.task.run([
            'connect:livereload',
            'watch'
        ]);
    });

    grunt.registerTask('build', [
        'clean:dist',
        'copy:dist',
        'cssmin:dist',
        'ngtemplates',
        'concat'
    ]);
};