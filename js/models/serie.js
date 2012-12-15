define([
  'underscore',
  'backbone'
], function(_, Backbone) {
  var Serie = Backbone.Model.extend({

	defaults: {},
    
    sum:  (1+2+3+4+5+6+7+8+9),
    size: 9,
    
    initialize: function(){
    	this.cels = [];
    },
    
    add: function(cel){
    	cel.bind('change:value', this.celChange, this);
    	if(this.celCount() > this.size){
    		throw new Error('you reach the limit of ' + this.size + ' for this serie');
    	}
    	this.cels.push(cel);
    },
    
    celChange: function(modifiedCel){
    	if(modifiedCel.hasChanged('value')){
    		_.each(this.cels, function(cel){
        		cel.updatePossibilities();
        	});
    	}
    },
    
    celCount: function(){
    	return this.cels.length;
    },
    
    allow: function(number){
    	var allow = true;
    	_.each(this.cels, function(cel){
    		allow = cel.get('value') != number ? allow : false;
    	});
    	return allow;
    }
  });
  
  

  return Serie;
});
