define([
  'jquery',
  'underscore',
  'backbone',
  'collections/hrows',
  'collections/changes',
  'models/change',
  'text!templates/cels.html',
  'text!templates/cel.html',
  'libs/hack/jquery'
  
], function($, _, Backbone, hrows, changes, Change, celsTemplate, celTemplate){
  
	var Sudoku = Backbone.View.extend({
    
		el: '#sudoku',
		
		events: {
			"keydown .cel input" :   "delCel",
	    	"keypress .cel input" :  "changeCel",
	    	"click .load" :    		 "load",
			"click .save" :    		 "save",
		    "click .resolve" : 		 "resolve",
	    	"click .lock" :    		 "lock",
		},
	
	    template : {
			cels: _.template(celsTemplate),
			cel: _.template(celTemplate)
		},
    	
		initialize: function (options) {
			this.collection = new options.collection;
			this.history = options.history;
			
			this.render().load();
			this.bindCels();
		},
	
		bindCels: function(){
			this.collection.each(function(cel){
				cel.bindPossibilities();
			});
		},
		
		render: function () {
			this.$el.html(this.template.cels(hrows));
            this.renderCels();
			return this;
	    },
	    
	    renderCels: function(){
	    	var root = $(this.el);
    		this.collection.each(function(cel){
	    		cel.bind('change', this.renderCel, this);
	    		cel.element = this.$el.find('#' + cel.identity());
	    		cel.element.data('model', cel);
	      	    this.renderCel(cel);
	    	}, this);
	    },
	    
	    renderCel: function(cel){
	    	cel.element.html(this.template.cel(cel));
	    },
	    
	    changeCel: function(e){
	    	e.preventDefault();
	    	
	    	var el = $(e.target).parent().parent(), code = e.keyCode, char = String.fromCharCode(code);
	    	if(/[1-9]/.test(char) && el.model().allow(char)){
	    		el.model().set('value', char);
	    	}
	    },
	    
	    delCel: function(e){
	    	var el =  $(e.target).parent().parent(), code = e.keyCode;
	    	if(code == '8' || code == '46'){
	    		e.preventDefault();
	    		if(!el.model().isLocked()){
	    			el.model().set('value', '');
	    		}
	    	}
	    },
	    
	    
	    lock: function(e){
	    	e.preventDefault();
	    	var cels = this.collection.withValue();
	    	
	    	_.each(cels, function(cel){
    			cel.lock();
    		});
	    },
	    
	    resolve: function(time){
	    	time = time || 200;
    		
	    	var possibilities = null;
	    	var list = this.collection.withoutValue().sortByPossibilities();
	    	var stop = false, change = null;
	    	
	    	var promise = $.eachTime(list, {
	    		time: time,
	    		context: this,
	    		value: function(cels){
	    			return stop ? null : cels.currentCel();
	    		}
	    	});
	    	
	    	$.when(promise)
	    	 .progress(function(type, cel, cels, deferrer){
	    		 if(type == 'call'){
	    			 possibilities = cel.get('possibilities');
	    	
	    			 console.log('id',  cel.cid,
						     'set', possibilities[0], 
						 	 'pos', possibilities.join(','),
						 	 'for', cel.get('forbidden').join(','));
    				 
	    			 if(!cels.celsWithoutPossibilities()){
	    			 
	    				 cel.set('value', possibilities[0]);
	    				 change = new Change({
							cel: cel,
							val: cel.get('value'),
						 	single: (possibilities.length == 1)
	    				 });
						 this.history.add(change);
						
						
						if(change.get('cel').cid == cels.next().cid){
							stop = true;
						}
						
	    			 }
	    			 else {
	    				console.log('REVERT');
	    				if(!this.history.revert(cels)){
	    			 		throw new Error('all possibilites tested, this sudoku can\'t be resolved !!!');
	    			 	}
	    				cels.reorderNextCels();		
	    			 	
	    			 }

	    			 deferrer.notifyWith(this, ['after', this.history]);
	    		 }
    		});
	    	
	    	return promise;
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
	    	_.each(data, function(celData){
		    	cel = collection.get(celData.id);
		    	cel.set('value', celData.value);
		    	cel.lock();
	    	});	
	    }
	    
	    
	   
  });
  return Sudoku;
});
