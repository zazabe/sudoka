define([
  'underscore',
  'backbone',
  'models/cel'
], function(_, Backbone) {
  var Cels = Backbone.Model.extend({
    defaults: {
      size: (9*9)
    },
    
    initialize: function(){
    	this.locked = false;
    	this.set({
    		forbidden: [],
    		possibilities: [1,2,3,4,5,6,7,8,9],
    		locked: false,
    		value: ''
    	});
    },
    
    bindPossibilities: function(){
    	this.set({possibilities: this.getPossibilities()});
        this.bind('updatePossibilities', this.updatePossibilities, this);
    },
    
    lock: function(){
    	this.set('locked', true);
    },
    
    isLocked: function(){
    	return this.get('locked');
    },
    
    reset: function(){
    	this.set({
    		forbidden: [],
    		possibilities: [1,2,3,4,5,6,7,8,9],
    		locked: false,
    		value: ''
    	});
    },
    
    match: function(attrs){
    	var match = true;
    	for(var name in attrs){
    		match = this.has(name) ? this.get(name) == attrs[name] ? match : false : false;
    	}
    	return match;
    },
    
    allow: function(number){
    	var allow = !this.isLocked();
    	allow = this.get('x').allow(number) ? allow : false;
    	allow = this.get('y').allow(number) ? allow : false;
    	allow = this.get('s').allow(number) ? allow : false;
    	allow = this.get('forbidden').indexOf(number) === -1 ? allow : false;
    	return allow;
    },
    
    updatePossibilities: function(){
    	this.set({
    		possibilities: this.getPossibilities()
    	});
    },
    
    getPossibilities: function(){
    	var numbers = [];
    	for(var i=1 ; i <= 9 ; i++){
			if(this.allow(i)){
				numbers.push(i);
			}
    	}
    	return numbers;
    },
    
    addForbiddenValue: function(number){
    	var forbidden = this.get('forbidden');
    	forbidden.push(number);
    	this.set('forbidden', forbidden);
    	this.updatePossibilities();
    },
    
    identity: function(){
    	return 'cel_' + this.cid;
    }
    	

  });
  return Cels;

});
