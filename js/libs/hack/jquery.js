require(['jquery'], function($){
	$.fn.model = function(){
		return $(this).data('model');
	};
	
	$.eachTime = function(collection, options){
		$.extend({
			time: 100,
			timeout: false,
			context: this,
			call: function(value){},
			value: function(subject){ return subject[0] ? subject[0] : null; },
			complete: function(time, iteration){}
		}, options);
		
		var call = {
			startAt: 0,
			interval: null,
			iteration: 0,
			deferrer: new $.Deferred(),
			
			promise: function(){
				var promise = this.deferrer.promise();
				var call = this;
				return $.extend({
					start: function(){
						call.start();
					},
					stop: function(){
						call.stop();
					},
					isRunning: function(){
						return call.isRunning();
					},
					toggle: function(){
						if(this.isRunning()){
							this.stop();
						}
						else {
							this.start();
						}
					}
				}, promise);
			},
			
			isRunning: function(){
				return !!this.interval;
			},
			execute: function(){
				value = options.value.apply(options.context, [collection]);
				if(value){
					this.deferrer.notifyWith(options.context, ['call', value, collection, this.deferrer]);
					if(!this.time){
						this.execute();
					}
				}
				else {
					this.stop();
					this.deferrer.resolveWith(options.context, [(this.time() - this.startAt), this.iteration]);
				}
			},
			
			step: function(){
				if(options.timeout && (this.time() - this.startAt) > options.timeout){
					this.error.apply(this, ['timeout (' + options.timeout + 'ms)']);
				}
				else {
					//try {
						this.execute.apply(this, []);
					//}
					//catch(e){
					//	this.error.apply(this, [e]);
					//}
				}
				call.iteration++;
			},
			
			error: function(e){
				this.stop();
				this.deferrer.rejectWith(options.context, [e, (this.time() - this.startAt), this.iteration]);
			},
			
			stop: function(){
				clearTimeout(this.interval);
				this.interval = null;
			},
			
			start: function(){
				var call = this;
				this.startAt = this.time();
				this.interval = setInterval(function(){call.step.apply(call)}, options.time, this);
				return this;
			},
			
			time: function(){
				return new Date().getTime();
			}
		};
		
		return call.start().promise();
	};
});