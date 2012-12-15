// Require.js allows us to configure shortcut alias
// Their usage will become more apparent futher along in the tutorial.
require.config({
  paths: {
    // Major libraries
    jquery: 'libs/jquery/jquery-min',
    underscore: 'libs/underscore/underscore-min', // https://github.com/amdjs
    backbone: 'libs/backbone/backbone', // https://github.com/amdjs

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
  'collections/changes',
  'views/sudoku',
  'views/controls'
], function($, Cels, changes, Sudoku, Controls){
	//create all cels
	var sudoku = new Sudoku({
		collection: Cels,
		history: changes
	});
	
	var controls = new Controls({
		sudoku: sudoku
	});
	
});
