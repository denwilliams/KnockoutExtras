(function (ko, $) {
	if (typeof ko === 'undefined' || typeof $ === 'undefined')
		return;
	
    /**
     * Binds the value to the HREF attribute
     * to use - <a data-bind="href: someObservable">Link</a>
     */
	ko.bindingHandlers.href = {
	    init: function (element, valueAccessor) {
	        var value = ko.utils.unwrapObservable(valueAccessor());
	        $(element).attr('href', value);
	    },
	    update: function (element, valueAccessor) {
	        var value = ko.utils.unwrapObservable(valueAccessor());
	        $(element).attr('href', value);
	    }
	};
    
    /**
     * Click Toggle binding for toggling boolean observables.
     * to use - data-bind="clickToggle: boolObservable"
     */
    ko.bindingHandlers.clickToggle = {
        init: function (element, valueAccessor) {
            var value = valueAccessor();
            if (ko.isObservable(value)) {
                $(element).click(function(e) {
                    value(!value());
                });
            }
        }
    };

    /**
     * Loads content (HTML) from an external page or source to the container.
     * to use - data-bind="externalContent: {url: '/stuff.html', loaderClass: 'loader', addCloseButton: false}"
     */
    ko.bindingHandlers.externalContent = {
        init: function (element, valueAccessor, allBindingsAccessor) {
            var value = ko.utils.unwrapObservable(valueAccessor());
            if (!typeof value === 'object')
                return;

            var $e = $(element);
            $e.html('<div class="' + value.loaderClass + '">Loading...</div>')
                .load(value.url, function (response, status, xhr) {
                    if (value.addCloseButton === true) {
                        $e.append('<div class="form-actions"><a href="#/" class="btn close-button">Close</a></div>');
                    }
                });
        }
    };

    /**
     * Loads & binds a HTML form from an external page to the container.
     * -- NEEDS MORE CUSTOMISATION OPTIONS --
     * to use - data-bind="form: {url: '/myform.html', loaderClass: 'loader', addButtons: true, onSubmit: someFunction, onCancel: someFunction, onLoad: someFunction}"
     */
    ko.bindingHandlers.form = {
        init: function (element, valueAccessor, allBindingsAccessor) {
            var value = ko.utils.unwrapObservable(valueAccessor());
            if (!typeof value === 'object')
                return;

            var $e = $(element);
            $e.html('<div class="' + value.loaderClass + '">Loading...</div>')
                .load(value.url, function (response, status, xhr) {
                    // get the form
                    var $form = $e.find('form');

                    if (value.addButtons === true) {
                        $form.append('<div class="form-actions"><button type="submit" class="btn btn-primary submit-form">Save changes</button> <a href="#/" class="btn cancel-form">Cancel</a></div>');
                    }

                    // add bootstrap styling to MVC validation
                    $e.find('.field-validation-error, .field-validation-valid').addClass('help-inline');
                    // attach validation
                    $.validator.unobtrusive.parse($form); //element + ' form');
                    // call this to validate form - $(modalId + ' form').validate().form();

                    // prevent enterkey presses on form input items
                    $e.find('input, select').keypress(function (event) {
                        if (event.keyCode == 13 && typeof value.onSubmit === 'function')
                            value.onSubmit($form);
                        return event.keyCode != 13;
                    });

                    //$e.find('button.submit-form').click(function (e) {
                    //    $form.submit();
                    //});

                    $form.submit(function () {
                        if (typeof value.onSubmit === 'function') {
                            return value.onSubmit($form);
                        }
                    });

                    $e.find('a.cancel-form').click(function (e) {
                        if (typeof value.onCancel === 'function') {
                            return value.onCancel(e, $form);
                        }
                    });

                    if (typeof value.onLoad === 'function') {
                        value.onLoad($form);
                    }
                });
        }
    };

    /**
     * Fits an element with absolute position in between 2 other elements.
     * to use - data-bind="fullHeight: {fitUnder: '#header', fitOver: '#footer'}"
     */
    ko.bindingHandlers.fullHeight = {
        init: function (element, valueAccessor) {
            var value = ko.utils.unwrapObservable(valueAccessor());
            $(window).resize(function () {
                // Initially set the element to be instantly visible/hidden depending on the value
                var fitUnder = 0,
                    fitOver = 0;
                if (value.fitUnder) {
                    fitUnder = $(value.fitUnder).height();
                }
                if (value.fitOver) {
                    fitOver = $(value.fitOver).height();
                }
                var h = $(window).height();
                //var a = window.app;

                h = h - fitUnder - fitOver;

                $(element).height(h);
            });

            $(window).resize();
        }
    };


    /**
     * Applies a class to an element when hovered over.
     * Optionally, apply it to a set of elements be specifying the selector.
     * to use (single element) -
     *   data-bind="hoverClass: 'hover'
     * (multiple elements) -
     *   data-bind="hoverClass: {selector: someitem, cssClass: 'hover'}"
     */
    ko.bindingHandlers.hoverClass = {
        init: function (element, valueAccessor) {
            var value = ko.utils.unwrapObservable(valueAccessor());
            if (value.selector) {
                $(element)
                    .on('mouseover', value.selector, function (e) {
                        $(this).addClass(value.cssClass);
                    }).on('mouseout', value.selector, function (e) {
                        $(this).removeClass(value.cssClass);
                    });
            } else if (typeof value === 'string') {
                $(element)
                    .on('mouseover', function (e) {
                        $(this).addClass(value);
                    }).on('mouseout', function (e) {
                        $(this).removeClass(value);
                    });
            }
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
        init: function (element, valueAccessor) {
            // Initially set the element to be instantly visible/hidden depending on the value
            var value = valueAccessor();
            $(element).toggle(ko.utils.unwrapObservable(value)); // Use "unwrapObservable" so we can handle values that may or may not be observable
        },
        update: function (element, valueAccessor, allBindingsAccessor) {
            // Whenever the value subsequently changes, slowly fade the element in or out
            var value = valueAccessor(),
                allBindings = allBindingsAccessor();

            var afterFadeIn = (typeof allBindings.afterFadeIn === 'function')
                ? allBindings.afterFadeIn
                : function () { };
            var afterFadeOut = (typeof allBindings.afterFadeOut === 'function')
                ? allBindings.afterFadeOut
                : function () { };

            ko.utils.unwrapObservable(value)
                ? $(element).fadeIn(200, afterFadeIn)
                : $(element).fadeOut(200, afterFadeOut);
        }
    };

	ko.bindingHandlers.slideVisible = {
	    init: function (element, valueAccessor) {
	        // Initially set the element to be instantly visible/hidden depending on the value
	        var value = valueAccessor();
	        $(element).toggle(ko.utils.unwrapObservable(value)); // Use "unwrapObservable" so we can handle values that may or may not be observable
	    },
	    update: function (element, valueAccessor, allBindingsAccessor) {
	        // Whenever the value subsequently changes, slowly fade the element in or out
	        var value = valueAccessor(),
                allBindings = allBindingsAccessor();

	        var afterSlideIn = (typeof allBindings.afterSlideIn === 'function')
                ? allBindings.afterSlideIn
                : function () { };
	        var afterSlideOut = (typeof allBindings.afterSlideOut === 'function')
                ? allBindings.afterSlideOut
                : function () { };

	        ko.utils.unwrapObservable(value)
                ? $(element).slideDown(100, afterSlideIn)
                : $(element).slideUp(100, afterSlideOut);
	    }
	};
})(ko, $);
