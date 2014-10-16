module.exports = function(grunt) {

    // Configure paths here
    var paths = {};

    // All roots should be configured here
    paths.roots = {
        // Where the source less files are stored
        styles: './src/less/',
        // Where we will place the intermediate build files
        build: './build/',
        // Where we will store the html,js for test pages
        test: './src/test/',
        // Where we will place the final distribution files
        dist: './dist/'
    };
//    paths.roots.views = paths.roots.app + 'Offline/';

    // Distribution paths
    paths.dist = {
        less: paths.roots.dist + 'styles/less/',
        css: paths.roots.dist + 'styles/css/',
        resources: paths.roots.dist + 'resources'
    };

    // Build paths
    paths.build = {
        css: paths.roots.build + 'css/'
    };

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // Set up the watcher for recompiling .less and livereload for debugging
        watch: {
            // Recompile the .css if there are any changes to any of the .less files
            styles: {
                files: [paths.roots.styles + '{,*/}*.less'],
                tasks: ['clean:styles', 'less'],
                options: {
                    livereload: true
                }
            },
            // Changes to any of the test files should also update
            tests: {
                files: [paths.roots.test + '{,*/}*.*'],
                tasks: ['clean', 'build'],
                options: {
                    livereload: true
                }
            }

        },

        connect:{
            server: {
                options: {
                    open: {
                        target: 'http://localhost:8000/index.html'
                    },
                    base: paths.roots.build,
                    livereload: true
                }
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
                },
                {
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
            dist: paths.roots.dist,
            styles: paths.dist.css
        },

        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: paths.roots.styles,
                    src: ['{,**/}*.{png,jpg,gif}'],
                    dest: paths.dist.resources
                }]
            }
        },

        copy: {
            main: {
                files: [
                    // Copy the test files to the build folder
                    {
                        expand: true,
                        src: [paths.roots.test + '*.html'],
                        dest: paths.roots.build,
                        flatten: true
                    },
                    {
                        expand: true,
                        src: [paths.roots.styles],
                        dest: './dist/'
                    }
                ]
            }
        }
    });

    //Load grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    //Dev task, use this task for developing real-time
    grunt.registerTask('dev', ['clean', 'imagemin:dist', 'less', 'copy', 'connect', 'watch']);

    // Build task
    grunt.registerTask('build', ['newer:imagemin:dist', 'newer:less', 'newer:copy']);

    // Default task
    grunt.registerTask('default', ['build']);
};