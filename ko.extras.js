(function (ko) {
	if (typeof ko === 'undefined')
		return;
	
	// ###################
	// #### COMPUTEDS ####
	// ###################
	
	/**
	 * Returns a computed variant of the array, where propertyName of each item
	 * matches the text from observableFilterInput
	 */
	ko.filteredArray = function(observableArray, observableFilterInput, propertyName) {
        return ko.computed(function() {
            var filter = ko.utils.unwrapObservable(observableFilterInput).toLowerCase();
            if (!filter) {
                return observableArray();
            } else {
                return ko.utils.arrayFilter(observableArray(), function (item) {
                    return ko.utils.unwrapObservable(item[propertyName])
                        .toLowerCase()
                        .indexOf(filter) >= 0;
                });
            }
        });
    };


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
	 * HH:mm:ss Knockout binding. Displays an integer number of seconds as HH:mm:ss.
	 * to use - data-bind="hhmmss: value"
	 */
	ko.bindingHandlers.hhmmss = {
		update: function(element, valueAccessor, allBindingsAccessor) {
			var value = ko.utils.unwrapObservable(valueAccessor());
			
			var sec_num = parseInt(value, 10); // don't forget the second parm
			var hours   = Math.floor(sec_num / 3600);
			var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
			var seconds = sec_num - (hours * 3600) - (minutes * 60);

			if (hours   < 10) {hours   = "0"+hours;}
			if (minutes < 10) {minutes = "0"+minutes;}
			if (seconds < 10) {seconds = "0"+seconds;}
			var time    = hours+':'+minutes+':'+seconds;   
	
			ko.bindingHandlers.text.update(element, function() { return time; });
		}
	};
	
	/**
	 * HH:mm Knockout binding. Displays an integer number of seconds as HH:mm (seconds not displayed).
	 * to use - data-bind="hhmm: value"
	 */
	ko.bindingHandlers.hhmm = {
		update: function(element, valueAccessor, allBindingsAccessor) {
			var value = ko.utils.unwrapObservable(valueAccessor());
			
			var sec_num = parseInt(value, 10); // don't forget the second parm
			var hours   = Math.floor(sec_num / 3600);
			var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
			var seconds = sec_num - (hours * 3600) - (minutes * 60);

			if (hours   < 10) {hours   = "0"+hours;}
			if (minutes < 10) {minutes = "0"+minutes;}
			if (seconds < 10) {seconds = "0"+seconds;}
			var time    = hours+':'+minutes;   
	
			ko.bindingHandlers.text.update(element, function() { return time; });
		}
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
