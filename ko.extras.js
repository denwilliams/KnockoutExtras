(function(ko, $) {
	if (typeof ko == 'undefined' || typeof $ == 'undefined')
		return;
	
	// ###################
	// #### FUNCTIONS ####
	// ###################
	
	/**
	 * Pushes all values to an array, only firing an event after
	 * all values have been added rather than each item.
	 */
	ko.observableArray.fn.pushAll = function(valuesToPush) {
	    var underlyingArray = this();
	    this.valueWillMutate();
	    ko.utils.arrayPushAll(underlyingArray, valuesToPush);
	    this.valueHasMutated();
	    return this;
	};
	
	/**
	 * Replaces all the values in a knockout array with a new set
	 */
	ko.observableArray.fn.replaceAll = function(valuesToPush) {
	    this(valuesToPush);
	    return this;
	};
	
	// ###################
	// #### EXTENDERS ####
	// ###################	
	
	/**
	 * Formats the numeric value to the specified number of decimal places.
	 * to use - var myValue = ko.observable(1.223123).extend({numeric: 1});
	 */
	ko.extenders.numeric = function(target, precision) {
	    var result = ko.dependentObservable({
	        read: function() {
	           return target().toFixed(precision); 
	        },
	        write: target 
	    });
	
	    result.raw = target;
	    return result;
	};

	// ##################
	// #### BINDINGS ####
	// ##################

	/**
	 * numericText Knockout binding.
	 * to use - data-bind="numericText: value, precision: 2"
	 */
	ko.bindingHandlers.numericText = {
	    update: function(element, valueAccessor, allBindingsAccessor) {
	       var value = ko.utils.unwrapObservable(valueAccessor()),
	           precision = ko.utils.unwrapObservable(allBindingsAccessor().precision) || ko.bindingHandlers.numericText.defaultPrecision,
	           formattedValue = value.toFixed(precision);
	
	        ko.bindingHandlers.text.update(element, function() { return formattedValue; });
	    },
	    defaultPrecision: 1  
	};

	/**
	 * JSON Knockout binding. Useful for debugging.
	 * to use - data-bind="json: value"
	 */
	ko.bindingHandlers.json = {
	    update: function(element, valueAccessor, allBindingsAccessor) {
	       var value = ko.utils.unwrapObservable(valueAccessor()),
	           formattedValue = JSON.stringify(value);
	
	        ko.bindingHandlers.text.update(element, function() { return formattedValue; });
	    }
	};

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
