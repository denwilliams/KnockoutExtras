/**
 * Binding handler for a twitter bootstrap slider
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
