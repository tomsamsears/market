/* 
 sywKiosk - Gruntfile.js
 Created: 08/28/2013
 Last Updated: N/A
 Author: Nicholas Shuttleworth (nshuttl)
 Description: 
 */

/* Use this file to build all your config options and init grunt */
var buildConfig = function(grunt) {
    //Build the projects config file
    var config = {
        folders : {
            bin    : 'dist',
            base   : 'src'
        },
        file : {
            types : {
                all    : ['**', '!.git', '!readme'],
                script : ['src/**/*.js'],
                style  : ['src/**/*.css'],
                scss   : ['src/**/*.scss'],
                html   : ['src/**/*.html','src/*.html']
            }
        }
    };

    //Copy settings
    var copyTypes = {
        /* Call this copy to reset  */
        'reset-projects' : {
            files: [
                {
                    expand : true,
                    dot    : true,
                    cwd    : '<%= config.folders.base %>',
                    dest   : '<%= config.folders.bin %>',
                    src    : '<%= config.file.types.all %>'
                }
            ]
        }
    };

    //Watch settings
    var watchTypes = {
        scripts: {
            files: '<%= config.file.types.script %>',
            tasks: ['cleanup']
        },
        html: {
            files: '<%= config.file.types.html %>',
            tasks: ['cleanup']
        },
        css: {
            files: '<%= config.file.types.style %>',
            tasks: ['cleanup']
        },

        scss: {
            files: '<%= config.file.types.scss %>',
            tasks: ['compass']
        }
    };

    //Build the grunt configs
    var gruntConfig = {
        //Package file
        pkg     : grunt.file.readJSON('package.json'),
        //Add the config information to grunt
        config  : config,
        //Clean method
        clean   : ['<%= config.folders.bin %>'],
        //Copy or merge files
        copy    : copyTypes,
        //Watch files for changes
        watch   : watchTypes,

    };

    //Insert configs into grunt
    grunt.initConfig(gruntConfig);

    //Return the grunt configs
    return gruntConfig;
};

/* Base function to create all needed grunt tasks for this project */
var buildTasks = function(grunt, config) {

    //Load in NPM tasks
    loadNpmTasks(grunt, config);

    //Create our server task
    Task.buildServer(grunt, config);

    /* Create a default if only $ grunt is run */
    grunt.registerTask('default', [
        'cleanup',//Clean bin and merge project files 
        'run:qa'//Start local server
    ]);
    
    grunt.registerTask('cleanup', [
        'clean',
        'copy:reset-projects'
    ]);

};

var loadNpmTasks = function(grunt, config) {
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-watch');
};

var Task = {
    buildServer : function(grunt, config) {
        /* Server connect task */
        grunt.registerTask('connect', function(serverType) {
            var fs = require('fs');
            var mimeLookup = require('mime');

            //Base folder - Same as config.folders.bin
            var baseFolder = './dist';

            var http = require('http');
            var url  = require('url');
            var mysqlModel = require('mysql-model');

            var port = {
                'qa' : 3000
            };

            /* We need these line incase we would like to have a proxy for certain paths */
            var httpProxy = require('http-proxy');
            var proxy = new httpProxy.RoutingProxy();
            var proxyServer = 'localhost',
                proxyPort = 8080;

            /* Start our server and watch the desired port for changes */    
            http.createServer(function(Request,Response){
            	
            	console.log('Request');
            	
                //First check if we need a proxy otherwise load through normal flow
                if (Request.url.match(/^(\/service\/)/g)) {

                    return proxy.proxyRequest(Request, Response, {
                        host: proxyServer,
                        port: proxyPort
                    });

                }

                var url_parts = url.parse(Request.url, true);
                var query = url_parts.query;

                var buildURL = function(parts) {

                    return baseFolder + ((!parts.pathname || parts.pathname === '/') ? '/index.html' : parts.pathname);
                };

                var requestURL = buildURL(url_parts);
                fs.exists(requestURL, function(exists) {

                    if (exists) {
                        fs.readFile(requestURL, function(error, content) {
                            if (error) {
                                Response.writeHead(500);
                                Response.end('Damn - ' + Request.url);
                            }
                            else {
                                Response.writeHead(200, { 'Content-Type': mimeLookup.lookup(requestURL) });
                                Response.end(content, 'utf-8');
                            }
                        });
                    } else {
                        Response.writeHead(404);
                        Response.end('Damn 404 - ' + requestURL);
                    }
                });
            }).listen(port[serverType]);
            
            console.log('Server running at http://localhost:'+port[serverType]+'/');
        });

        /* Create a task to start server */
        grunt.registerTask('run', ['watch']);
        grunt.registerTask('run:dev', ['connect:dev', 'run']);
        grunt.registerTask('run:qa', ['connect:qa', 'run']);
        grunt.registerTask('run:prod', ['connect:prod', 'run']);
    }
};

/*  */
module.exports = function(grunt) {

    //Build our config options
    var gruntConfig = buildConfig(grunt);

    //Build our grunt tasks
    buildTasks(grunt, gruntConfig);

};