var singleton = singleton || {};

define([
  'collections/series',
  'models/row'
], function(Series, Row){
  var HRows = Series.extend({
    model: Row,
  
    initialize: function(){
	  for(var i=0 ; i < this.size ; i++){
		  this.add({id: i});
	  }
    }
  });

  if(!singleton.hrows){
	  singleton.hrows = new HRows();
  }
  return singleton.hrows;
});
