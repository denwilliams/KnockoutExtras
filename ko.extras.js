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
    this.removeAll();
    this.pushAll(valuesToPush);
    return this;
};

// to use - var myValue = ko.observable(1.223123).extend({numeric: 1});
/**
 * Formats the numeric value to the specified number of decimal places
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

//({ type: "numeric", precision: 2 }).
/**
 * numericText Knockout binding
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
