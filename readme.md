## Bindings

**numericText** - Similar to the text binding, but for a numeric value, to use: { type: "numeric", precision: 2 }

### Bootstrap Bindings

**modal** - Binds a modal dialog

**slider** - Binds a slider control

## Functions

### Arrays

**pushAll** - pushes an array of items to an observable array without firing a new event for each item.
```
var myArray = ko.observableArray([]);
myArray.pushAll(additionalValues);
```

**replaceAll** - replaces all items in an observable array without firing a new event for each item.
```
var myArray = ko.observableArray(initialValues);
myArray.replaceAll(newValues);
```

## Extenders

**numeric** - formats a numeric observable to the specified number of decimal places, eg:
```javascript
var myValue = ko.observable(1.223123).extend({numeric: 1});
```

## Transitions

None yet