## Bindings

''numericText'' - Similar to the text binding, but for a numeric value, to use: { type: "numeric", precision: 2 }

### Bootstrap Bindings

''modal'' - Binds a modal dialog

''slider'' - Binds a slider control

## Functions

### Arrays

''pushAll'' - pushes an array of items to an observable array without firing a new event for each item.

''replaceAll'' - replaces all items in an observable array without firing a new event for each item.

## Extenders

''numeric'' - formats a numeric observable to the specified number of decimal places, eg:

var myValue = ko.observable(1.223123).extend({numeric: 1});


## Transitions

None yet