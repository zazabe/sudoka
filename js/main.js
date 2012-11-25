// Require.js allows us to configure shortcut alias
// Their usage will become more apparent futher along in the tutorial.
require.config({
  paths: {
    // Major libraries
    jquery: 'libs/jquery/jquery-min',
    underscore: 'libs/underscore/underscore-min', // https://github.com/amdjs
    backbone: 'libs/backbone/backbone-min', // https://github.com/amdjs

    // Require.js plugins
    text: 'libs/require/text',
    order: 'libs/require/order',

    templates: '../templates'
  }

});

// Let's kick off the application

var sodoku = null;

require([
  'jquery',
  'collections/cels',
  'views/sudoku',
  'libs/hack/jquery'
  
], function($, Cels, Sudoku){
	//create all cels
	sudoku = new Sudoku({
		collection: Cels
	});
	
	
	
});
