var singleton = singleton || {};

define([
  'collections/series',
  'models/row'
], function(Series, Row){
  var VRows = Series.extend({
    model: Row,
    
    initialize: function(){
	  for(var i=0 ; i < this.size ; i++){
		  this.add({id: i});
	  }
    }
  });

  if(!singleton.vrows){
	  singleton.vrows = new VRows();
  }
  return singleton.vrows;
});
