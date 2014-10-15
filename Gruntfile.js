module.exports = function(grunt) {

    // Configure paths here
    var paths = {};

    // All roots should be configured here
    paths.roots = {
        styles: './src/less/',
        build: './build/',
        test: './src/test/'
    };
//    paths.roots.views = paths.roots.app + 'Offline/';

    // Distribution paths
    /*
    paths.dist = {
        styles: paths.roots.dist + 'css/',
        assets: paths.roots.dist + 'Images/',
        views: paths.roots.dist + 'Offline/',
        scripts: paths.roots.dist + 'scripts/',
    };
    */

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
                    dest: paths.dist.styles,
                    ext: '.css'
                }]
            },
        },

        // Cleanup task where to clean out the dist folder
        clean: {
            styles: paths.dist.styles
        },

        // imagemin: {
        //     dist: {
        //         files: [{
        //             expand: true,
        //             cwd: paths.roots.assets,
        //             src: ['{,**/}*.{png,jpg,gif}'],
        //             dest: paths.dist.assets
        //         }]
        //     }
        // },

        copy: {
            main: {
                files: [
                    // includes files within path and its sub-directories
                    // TODO: May want to minify the js rather than just copy
                    {
                        expand: true,
                        src: [paths.roots.'./src/app/scripts/**'],
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