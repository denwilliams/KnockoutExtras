(function(ko, $) {
	if (typeof ko == 'undefined' || typeof $ == 'undefined')
		return;

	// ##################
	// #### BINDINGS ####
	// ##################

	// see http://figg-blog.tumblr.com/post/32733177516/infinite-scrolling-knocked-out

// apply this to a div. whenever the div is reached the function will be called
// eg: scroll: collection().length < 160, scrollOptions: { loadFunc: addSome, offset: 10 }
ko.bindingHandlers.scroll = {
 
  updating: true,
 
  init: function(element, valueAccessor, allBindingsAccessor) {
      var self = this
      self.updating = true;
      ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
            $(window).off("scroll.ko.scrollHandler")
            self.updating = false
      });
  },
 
  update: function(element, valueAccessor, allBindingsAccessor){
    var props = allBindingsAccessor().scrollOptions
    var offset = props.offset ? props.offset : "0"
    var loadFunc = props.loadFunc
    var load = ko.utils.unwrapObservable(valueAccessor());
    var self = this;
 
    if(load){
      element.style.display = "";
      $(window).on("scroll.ko.scrollHandler", function(){
        if(($(document).height() - offset <= $(window).height() + $(window).scrollTop())){
          if(self.updating){
            loadFunc()
            self.updating = false;
          }
        }
        else{
          self.updating = true;
        }
      });
    }
    else{
        element.style.display = "none";
        $(window).off("scroll.ko.scrollHandler")
        self.updating = false
    }
  }
}

	// #####################
	// #### TRANSITIONS ####
	// #####################

	/**
	 * Similar to the visible binding, except that it fades the element in and out.
	 * Requires jQuery.
	 * Note: this is taken direct from the Knockout website
	 */
	ko.bindingHandlers.fadeVisible = {
	    init: function(element, valueAccessor) {
	        // Initially set the element to be instantly visible/hidden depending on the value
	        var value = valueAccessor();
	        $(element).toggle(ko.utils.unwrapObservable(value)); // Use "unwrapObservable" so we can handle values that may or may not be observable
	    },
	    update: function(element, valueAccessor) {
	        // Whenever the value subsequently changes, slowly fade the element in or out
	        var value = valueAccessor();
	        ko.utils.unwrapObservable(value) ? $(element).fadeIn() : $(element).fadeOut();
	    }
	};
})(ko, $);
