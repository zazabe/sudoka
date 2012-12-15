define([
  'jquery',
  'underscore',
  'backbone',
  'models/cel',
  'collections/series',
  'collections/hrows',
  'collections/vrows',
  'collections/squares',
  
], function($, _, Backbone, Cel, Series, HRows, VRows, Squares){
  
	var Cels = Series.extend({
    	model: Cel,
    	
		current: 0,
    	
		size: (9*9),
		
	    initialize: function(models) {
			if(!models){
				var cel = null, hrow = null, vrow = null, square = null, x = null, y = null, s = null;
				for ( var i = 0; i < 9; i++) {
					for ( var j = 0; j < 9; j++) {
						x = i, y = j, s = ((Math.floor(i / 3) * 3) + Math.floor(j / 3));
						hrow = HRows.get(x);
						vrow = VRows.get(y);
						square = Squares.get(s);

						cel = new Cel({
							id : (x * 9) + y,
							value : '',
							x : hrow,
							y : vrow,
							s : square
						});

						this.add(cel);
						hrow.add(cel);
						vrow.add(cel);
						square.add(cel);
					}
				}
			}
		},
		
		hRow: function(x){
			return this.filter({x: x});
		},
		
		vRow: function(y){
			return this.filter({y: y});
		},
		
		square: function(s){
			return this.filter({s: s});
		},
		
		next: function(){
			this.current = this.current+1 < this.length ? this.current+1 : this.current; 
			return this.currentCel();
		},
		
		prev: function(){
			this.current = this.current-1 >= 0 ? this.current-1 : this.current; 
			return this.currentCel();
		},
		
		currentCel: function(){
			return this.at(this.current);
		},
		
		clear: function(){
			this.each(function(model){
				model.reset();
				
			});
		},
		
		reduce: function(filter){
			return new Cels(this.filter(function(model){
				return model.match(filter);
			}));
		},
		
		withoutValue: function(){
			return this.reduce({value: ''});
		},
		
		withValue: function(){
			return this.filter(function(model){
				return /[1-9]/.test(model.get('value'));
			});
		},
		
		celsWithoutPossibilities: function(){
			var nb = 0, group = false;
			
			this.each(function(model){
				if(model.get('possibilities').length == 0 && model.get('value') == ''){
					nb++;
					if(!group){group=true;console.groupCollapsed('celsWithoutPossibilities');}
					console.log('no possibilities for', model.cid, 'for', model.get('forbidden').join(','));
				}
				
			});
			
			if(group){console.groupEnd();}
			
			return nb > 0;
		},
		
		reorderNextCels: function(){
			var pos = this.current, list = this;
			var nexts = new Cels(this.filter(function(model, index){ 
				return index > pos;
			}));
			nexts.sortByPossibilities().each(function(cel){
				list.remove(cel);
				list.add(cel);
			});
			nexts = null;
			return this;
		},
		
		count: function(){
			var count = 0;
			this.each(function(model){
				count += model.get('value');
			});
			return count;
		},
		
		sortByPossibilities: function(){
			return new Cels(this.sortBy(function(model){
				return model.get('possibilities').length;
			}));
		},
		
		getEmptyCelWithLessPossibilities: function(){
			var found = null, possibilities = 9;
			this.each(function(cel){
				if(cel.get('value') == '' && cel.get('possibilities').length < possibilities){
					possibilities = cel.get('possibilities');
					found = cel;
				}
			});
			return found;
		}
		
	});

	return Cels;
});
