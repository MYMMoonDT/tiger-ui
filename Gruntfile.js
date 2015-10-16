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
            concat: {
                files: ['<%= tiger.app %>/scripts/directives/**/*.js'],
                tasks: ['concat:directives']
            },
            html2js: {
                files: ['<%= tiger.app %>/scripts/directives/**/*.html'],
                tasks: ['html2js:directives']
            },
            all: {
                files: ['<%= tiger.app %>/scripts/tiger-ui.js', '<%= tiger.app %>/scripts/tiger-tpl.js'],
                tasks: ['concat:all']
            },
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
                    '!<%= tiger.app %>/scripts/directives/*.js',
                    '!<%= tiger.app %>/scripts/tiger-tpl.js',
                    '!<%= tiger.app %>/scripts/tiger-ui.js',
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
                            'styles/tiger-ui.css',
                            'scripts/tiger-ui-tpl.js',
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
            options: {
                
            },
            directives: {
                src: [
                    '<%= tiger.app %>/scripts/directives/tiger-router-tabs/**/*.js',
                    '<%= tiger.app %>/scripts/directives/tiger-datepicker/**/*.js'
                ],
                dest: '<%= tiger.app %>/scripts/tiger-ui.js'
            },
            all: {
                options: {
                    banner: 'angular.module("ui.tiger", ["ui.tiger.tpl", "ui.tiger.datepicker", "ui.tiger.routerTabs"]);\n'
                },
                src: [
                    '<%= tiger.app %>/scripts/tiger-tpl.js',
                    '<%= tiger.app %>/scripts/tiger-ui.js'
                ],
                dest: '<%= tiger.app %>/scripts/tiger-ui-tpl.js'
            }
        },

        html2js: {
            options: {
                base: '<%= tiger.app %>',
                module: 'ui.tiger.tpl'
            },
            directives: {
                src: [
                    '<%= tiger.app %>/scripts/directives/tiger-router-tabs/**/*.html',
                    '<%= tiger.app %>/scripts/directives/tiger-datepicker/**/*.html'
                ],
                dest: '<%= tiger.app %>/scripts/tiger-tpl.js'
            }
        },

        uglify: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= tiger.dist %>/scripts',
                    src: ['*.js'],
                    dest: '<%= tiger.dist %>/scripts',
                    ext: '.min.js'
                }]
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
        'uglify:dist'
    ]);
};