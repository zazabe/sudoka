define([
  'jquery',
  'underscore',
  'backbone'
], function($, _, Backbone){
  var Series = Backbone.Collection.extend({
    size:  9,
    
    initialize: function(){
	}
  });

  return Series;
});
