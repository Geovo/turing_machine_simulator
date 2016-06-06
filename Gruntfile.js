module.exports = function(grunt) {

    // Add the grunt-mocha-test tasks.
    grunt.loadNpmTasks('grunt-mocha-test');
	// load coffee
	grunt.loadNpmTasks('grunt-contrib-coffee');
	// load sass
	grunt.loadNpmTasks('grunt-contrib-sass');
    // load watcher task
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.config('mochaTest', {
		test: {
			options: {
				reporter: 'spec',
				captureFile: 'results.txt', // Optionally capture the reporter output to a file
				quiet: false, // Optionally suppress output to standard out (defaults to false)
				clearRequireCache: false // Optionally clear the require cache before running tests (defaults to false)
			},
			src: ['tests/**/*.js']
		}
        }
    );
	
	// set up coffe
	grunt.config('coffee', {
		app: {
			options: {
				bare: true
			},
			files: {
				'turing.js': ['coffeescript/parser.coffee',
							  'coffeescript/turing.coffee',
							  'coffeescript/app.coffee']
			}
		}
	});
	
	// set up sass
	grunt.config('sass', {
		app: {
			files: {
				'styles/style.css': ['sass/style.scss']
			}
		}
	});

	// set up watch
    grunt.config('watch', {
        scripts: {
            files: ['coffeescript/**/*.coffee'],
            tasks: ['coffee'],
            options: {
                spawn: false
            }
        },
		styles: {
			files: ['sass/**/*.scss'],
			tasks: ['sass'],
			options: {
				spawn: false
			}
		}
    });
	
	// register tasks here
	grunt.registerTask('test', 'mochaTest');
};
