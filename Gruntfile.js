module.exports = function(grunt) {

    // Configure paths here
    var paths = {};

    // All roots should be configured here
    paths.roots = {
        // Where the source less files are stored
        styles: 'src/less/',
        // Where we will place the intermediate build files
        build: 'build/',
        // Where we will store the html,js for test pages
        test: 'src/test/',
        // Where we will place the final distribution files
        dist: 'dist/',
        // The library files
        libs: 'src/libs/',
        // The script files
        scripts: 'src/scripts/',
        // The script files
        resources: 'src/resources/',
        // The node modules
        nodeModules: 'node_modules/'
    };

    var livereloadPort = 35730;

    //    paths.roots.views = paths.roots.app + 'Offline/';

    // Distribution paths
    paths.dist = {
        less: paths.roots.dist + 'less/',
        css: paths.roots.dist + 'css/',
        resources: paths.roots.dist + 'resources/',
        fonts: paths.roots.dist + 'fonts/',
        scripts: paths.roots.dist + 'scripts/',
    };

    // Build paths
    paths.build = {
        css: paths.roots.build + 'css/',
        fonts: paths.roots.build + 'fonts/',
        scripts: paths.roots.build + 'scripts/',
        resources: paths.roots.build + 'resources/',
    };

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // Set up the watcher for recompiling .less and livereload for debugging
        watch: {
            // Recompile the .css if there are any changes to any of the .less files
            styles: {
                files: [paths.roots.styles + '{,*/}*.less'],
                tasks: ['build'],
                options: {
                    livereload: livereloadPort
                }
            },
            // Changes to any of the test files should also update
            tests: {
                files: [paths.roots.test + '{,*/}*.*'],
                tasks: ['build'],
                options: {
                    livereload: livereloadPort
                }
            },
            // Changes to any of the scripts should reload
            scripts: {
                files: [paths.roots.scripts + '{,*/}*.js'],
                tasks: ['build'],
                options: {
                    livereload: livereloadPort
                }
            }

        },

        // Connect and serve the test pages
        connect: {
            server: {
                options: {
                    open: {
                        target: 'http://localhost:8000/index.html'
                    },
                    base: paths.roots.build,
                    livereload: livereloadPort
                }
            }
        },

        // Minify the css
        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: paths.build.css,
                    src: ['*.css', '!*.min.css', '!*test.css'],
                    dest: paths.dist.css,
                    ext: '.less.min.css'
                }]
            }
        },

        // Compile the .less files
        less: {
            server: {
                options: {
                    //compress: true,
                    //optimization: 2,
                    ieCompat: true,
                    strictImports: true,
                    strictMath: true,
                    strictUnits: true,
                    //cleancss: true,
                    paths: paths.roots.styles
                },
                files: [{
                    expand: true,
                    cwd: paths.roots.styles,
                    src: '{,**/}[^_]*.less',
                    dest: paths.build.css,
                    ext: '.less.css'
                }, {
                    expand: true,
                    cwd: paths.roots.test,
                    src: '{,**/}[^_]*.less',
                    dest: paths.build.css,
                    ext: '-test.css'
                }]
            },
        },

        // Cleanup task where to clean out the dist folder
        clean: {
            build: paths.roots.build,
            dist: paths.roots.dist
        },

        // Minify any images
        imagemin: {
            main: {
                files: [{
                    expand: true,
                    cwd: paths.roots.resources,
                    src: ['{,**/}*.{png,jpg,gif,icns,ico}'],
                    dest: paths.build.resources
                }]
            }
        },

        // Minify the js
        uglify : {
            dist : {
                files : [{
                    expand: true,
                    cwd: paths.build.scripts,
                    src: '*.js',
                    dest: paths.dist.scripts,
                    ext: '.min.js'
                }]
            }
        },

        // Ensure all files are copied
        copy: {
            main: {
                files: [
                    // Copy the test index files to the build folder
                    {
                        expand: true,
                        cwd: paths.roots.test,
                        src: ['*.html'],
                        dest: paths.roots.build,
                        flatten: true
                    },
                    // Copy the fonts
                    {
                        expand: true,
                        cwd: paths.roots.libs + 'font-awesome/fonts/',
                        src: ['*'],
                        dest: paths.build.fonts,
                        flatten: true
                    },
                    // Copy the fonts
                    {
                        expand: true,
                        cwd: paths.roots.nodeModules + 'bootstrap/fonts',
                        src: ['*'],
                        dest: paths.build.fonts,
                        flatten: true
                    },
                    // Copy the scripts
                    {
                        expand: true,
                        cwd: paths.roots.nodeModules + 'bootstrap/dist/js',
                        src: ['bootstrap.js'],
                        dest: paths.build.scripts,
                        flatten: true
                    },
                    {
                        expand: true,
                        cwd: paths.roots.scripts,
                        src: ['*.js'],
                        dest: paths.build.scripts,
                        flatten: true
                    }
                ]
            },
            dist: {
                files: [
                    // Copy the less files to the dist folder
                    {
                        expand: true,
                        cwd: paths.roots.styles,
                        src: ['*.less'],
                        dest: paths.dist.less,
                    },
                    // Copy the fonts
                    {
                        expand: true,
                        cwd: paths.build.fonts,
                        src: ['*'],
                        dest: paths.dist.fonts,
                        flatten: true
                    },
                    // Copy the resources
                    {
                        expand: true,
                        cwd: paths.build.resources,
                        src: ['*'],
                        dest: paths.dist.resources,
                        flatten: true
                    }
                ]
            }
        }
    });

    //Load grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    //Dev task, use this task for developing real-time
    grunt.registerTask('dev', ['dist', 'connect', 'watch']);

    // Build task
    grunt.registerTask('dist', ['clean', 'build']);

    // Build task
    grunt.registerTask('build', ['newer:imagemin', 'less', 'newer:cssmin', 'newer:copy', 'newer:uglify']);

    // Default task
    grunt.registerTask('default', ['dev']);
};