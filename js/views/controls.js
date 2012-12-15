define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/controls.html',
  'text!templates/history.html',
  'libs/hack/jquery'
  
], function($, _, Backbone, controlsTemplate, historyTemplate){
  
	var Controls = Backbone.View.extend({
    
		el: '#controls',
		
		events: {
			"click .clear" :	"clear",
			"click .load" :    	"load",
			"click .save" :    	"save",
		    "click .resolve" : 	"resolve",
	    	"click .lock" :    	"lock",
		},
	
	    template : {
			history: _.template(historyTemplate),
			controls: _.template(controlsTemplate)
		},
    	
		initialize: function (options) {
			this.sudoku = options.sudoku;
			this.collection = this.sudoku.collection;
			this.render();
		},
	
		render: function () {
			this.$el.html(this.template.controls(this.sudoku));
        	return this;
	    },
	    
	    clear: function(e){
	    	e.preventDefault();
	    	localStorage.setItem('sudoku', '[]');
	    	this.load();
	    },
	    
	    lock: function(e){
	    	e.preventDefault();
	    	var cels = this.collection.withValue();
	    	
	    	_.each(cels, function(cel){
    			cel.lock();
    		});
	    },
	    
	    resolve: function(e){
	    	e.preventDefault();
	    	var el = $(e.target);
	    	
	    	if(!this.resolution || this.resolution.state() != 'pending'){
	    		var time = $('#step', this.$el).val(), 
	    		    result = $('#result ul', this.$el), 
	    		    controls = this;
	    		
	    		
		    	el.html('pause');
		    	result.html('');
		    	
		    	this.resolution = this.sudoku.resolve(time);
		    	
		    	$.when(this.resolution)
		    	.progress(function(type, history){
		    		if(type == 'after'){
		    			result.html(controls.template.history(history));
			    	}
		    	})
		    	.always(function(){
		    		el.html('resolve');
		    		controls.resolution = null;
		    	})
		    	.done(function(time, iteration){
		    		result.prepend($('<li class="success">').html('sudoku resolved with ' + iteration + ' iteration in ' + (time/1000) + 's'));
			    })
			    .fail(function(e, time, iteration){
			    	console.error('resolution failed', e.message, e.stack);
			    	result.prepend($('<li class="error">').html('impossible to solve this sudoku, tried with ' + iteration + ' iteration in ' + (time/1000) + 's'));
			    });
		    }
	    	else {
	    		this.resolution.toggle();
	    		el.html(this.resolution.isRunning() ? 'pause' : 'resume');
		    }
    	},
    	
	    
	    save: function(e){
	    	e.preventDefault();
		    var cels = this.collection.withValue();
	    	var data = [];
	    	_.each(cels, function(cel){
	    		if(cel.isLocked()){
	    			data.push({id: cel.get('id'), value: cel.get('value')});
	    		}
	    	});	
	    	
	    	localStorage.setItem('sudoku', JSON.stringify(data));
	    },
	    
	    load: function(e){
	    	if(e) e.preventDefault();
		    var data = JSON.parse(localStorage.getItem('sudoku')), cel = null, collection = this.collection;
		    collection.clear();
		    _.each(data, function(celData){
		    	cel = collection.get(celData.id);
		    	cel.set('value', celData.value);
		    	cel.lock();
	    	});	
	    }
  });
	
  return Controls;
});
