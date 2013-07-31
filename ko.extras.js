(function (ko) {
	if (typeof ko === 'undefined')
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

    /**
     * Inverts or toggles a boolean observable.
     * to use - var obs = ko.observable(false);
     * obs.toggle();
     */
	ko.observable.fn.toggle = function (arg) {
	    this(!this());
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
	
	/**
     * Sets the HREF attribute (for links)
     */
    ko.bindingHandlers.href = {
        update: function (element, valueAccessor) {
            var value = ko.utils.unwrapObservable(valueAccessor());
            ko.bindingHandlers.attr.update(element, function () { return { href: value }; });
        }
    };
    
    /**
     * Sets the SRC attribute (for images)
     */
    ko.bindingHandlers.src = {
        update: function (element, valueAccessor) {
            var value = ko.utils.unwrapObservable(valueAccessor());
            ko.bindingHandlers.attr.update(element, function () { return { src: value }; });
        }
    };
    
    /**
     * Alias for the inverse of visible
     */
    ko.bindingHandlers.hidden = {
        update: function (element, valueAccessor) {
            var value = ko.utils.unwrapObservable(valueAccessor());
            ko.bindingHandlers.visible.update(element, function () { return !value; });
        }
    };

})(ko);
