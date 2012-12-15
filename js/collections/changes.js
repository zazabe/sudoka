var singleton = singleton || {};

define([
    'jquery',
    'underscore',
    'backbone',
    'models/change'
], function($, _, Backbone, Change){
  
  var Changes =  Backbone.Collection.extend({
    model: Change,

    initialize: function(){
    },
    
    revert: function(cels){
    	var stop = false, current = this.length-1, change = null;
    	
    	while(!stop && current >= 0){
    		change = this.at(current);
    		
    		var cel = change.get('cel');
    		
			if(change.get('single') == false){
				console.log('forbidden ' + change.get('val') + ' on ' + change.get('cel').cid);
				cel.addForbiddenValue(change.get('val'));
    			stop = true;
    		}
    		else {
				cel.set({
					forbidden: []
				});
			}
			
			cel.set({
				value: ''
			});
			
			current--;
			this.remove(change);
			cels.prev();
    	}
    	
    	return change.get('cel').getPossibilities().length > 0;
    }  
  });

  
  
  if(!singleton.changes){
	  singleton.changes = new Changes();
  }
  return singleton.changes;
});
