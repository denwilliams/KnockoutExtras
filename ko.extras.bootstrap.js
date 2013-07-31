(function(ko, $) {
	if (typeof ko == 'undefined' || typeof $ == 'undefined')
		return;
	
    // ##############
    // BOOTSTRAP CORE
    // ##############
	
	/**
	 * Binding for a twitter bootstrap modal
	 */
	ko.bindingHandlers.modal = {
	    init: function (element, valueAccessor, allBindingsAccessor) { 
	    	//console.log('--Binding modal--');
	    },
	    update: function (element, valueAccessor) {
	        var observable = valueAccessor();
	        var value = ko.utils.unwrapObservable(observable);
	        function onClose() {
	        	console.log('hiding modal');
	        	$(element).off('hidden', onClose);
	        	if (value) {
	        		observable(false);
	        	}
	        };
	        if (value) {
	        	console.log('showing modal');
	            $(element).modal('show').on('hidden', onClose);
	            // this is to focus input field inside dialog
	            $("input", element).focus();
	        }
	        else {
	        	console.log('hiding modal');
	            $(element).modal('hide');
	        }
	    }
	};


    /**
     * Applies a tooltip to an elment
     * to use - <a title="Tooltip text" data-bind="tooltip: true">abcd</a>
     */
	ko.bindingHandlers.tooltip = {
	    init: function (element, valueAccessor, allBindingsAccessor) {
	        $(element).tooltip();
	    }
	};

    /**
     * Applies tooltips to the sub elements matching the selector supplied through the binding
     * to use - 
     * <div data-bind="tooltips: '.navitem'> 
     *   <a title="Tooltip text" class="navitem">One</a>
     *   <a title="Tooltip text 2" class="navitem">Two</a>
     * </div>
     */
	ko.bindingHandlers.tooltips = {
	    init: function (element, valueAccessor, allBindingsAccessor) {
	        var value = ko.utils.unwrapObservable(valueAccessor());
	        $(element).find(value).tooltip();
	    }
	};


    // #################
    // BOOTSTRAP PLUGINS
    // #################

    /**
	 * Binding handler for a twitter bootstrap slider (plugin)
	 */
	ko.bindingHandlers.slider = {
	    init: function (element, valueAccessor, allBindingsAccessor) {
	        //initialize datepicker with some optional options
	        //var options = allBindingsAccessor().datepickerOptions || {};
	        $(element).slider().on("slideStop", function (ev) {
	            var observable = valueAccessor();
	            //console.log(JSON.stringify(ev));
	            observable(ev.value);
	        });
	    },
	    update: function (element, valueAccessor) {
	        var value = ko.utils.unwrapObservable(valueAccessor());
	        $(element).slider('setValue', value);
	        //.datepicker("setValue", value);
	    }
	};

    /**
	 * Binding handler for a twitter bootstrap datepicker (plugin)
	 */
	ko.bindingHandlers.datepicker = {
	    init: function (element, valueAccessor, allBindingsAccessor) {
	        //initialize datepicker with some optional options
	        var options = allBindingsAccessor().datepickerOptions || {};
	        var value = valueAccessor();
	        if (ko.isObservable(value)) {
	            value = value();
	        }
	        value = new Date(new Date(value).toUTCString());
	        var d = value.format('yyyy-mm-dd'); // ### REQUIRES DATEFORMAT.JS ###
	        $(element).data('date', d).data('date-format', 'yyyy-mm-dd');
	        $(element).datepicker(options);
	        $(element).datepicker('update', d);

	        //when a user changes the date, update the view model
	        ko.utils.registerEventHandler(element, "changeDate", function (event) {
	            var value = valueAccessor(); // this will be a UTC date... we need to make this local
	            var d = new Date(event.date.getFullYear(), event.date.getMonth(), event.date.getDate());
	            if (ko.isObservable(value)) {
	                value(d);
	            }
	        });
	    },
	    update: function (element, valueAccessor) {
	        var widget = $(element).data("datepicker");
	        //when the view model is updated, update the widget
	        if (widget) {
	            // convert the date to UTC
	            var date = ko.utils.unwrapObservable(valueAccessor());
	            widget.date = new Date(new Date(date).toUTCString());
	            widget.setValue();
	        }
	    }
	};

	
})(ko, $);