var singleton = singleton || {};

define([
  'collections/series',
  'models/square'
], function(Series, Square){
  var Squares = Series.extend({
    model: Square,
    size: 9,
    initialize: function(){
	  for(var i=0 ; i < this.size ; i++){
		  this.add({id: i});
	  }
    }
  });

  if(!singleton.squares){
	  singleton.squares = new Squares();
  }
  return singleton.squares;
});
