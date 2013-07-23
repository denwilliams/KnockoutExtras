NOTE: Check out the test.html page for a working example

## Bindings

**numericText** - Similar to the text binding, but for a numeric value, to use: 

```javascript
data-bind="numericText: numberValue, precision: 2"
```

**json** - Displays the selected value or object in JSON notation. Useful for debugging: 

```javascript
data-bind="json: value"
```

### Bootstrap Bindings

**modal** - Binds a modal dialog

To use, specify data-bind="modal: boolValue", eg:

```
<a href="#" class="btn" data-bind="click: showModalToggle">Modal Test</a>

<div class="modal hide fade" data-bind="modal: showModal">
  <div class="modal-header">
    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
    <h3>Modal header</h3>
  </div>
  <div class="modal-body">
    <p>One fine body</p>
    <form data-bind="submit:showModalToggle"></form>
  </div>
  <div class="modal-footer">
    <a href="#" class="btn" data-bind="click: showModalToggle">Close</a>
    <a href="#" class="btn btn-primary">Save changes</a>
  </div>
</div>
```

**slider** - Binds a slider control

To use, specify  data-bind="modal: boolValue", eg:

```
<input type="text" value="0" data-bind="slider: sliderValue" data-slider-min="0" data-slider-max="10" data-slider-step="1" data-slider-value="0" data-slider-orientation="horizontal" data-slider-selection="after" data-slider-tooltip="hide">
```

## Functions

### Arrays

**pushAll** - pushes an array of items to an observable array without firing a new event for each item.
```javascript
var myArray = ko.observableArray([]);
myArray.pushAll(additionalValues);
```

**replaceAll** - replaces all items in an observable array without firing a new event for each item.
```javascript
var myArray = ko.observableArray(initialValues);
myArray.replaceAll(newValues);
```

## Extenders

**numeric** - formats a numeric observable to the specified number of decimal places, eg:
```javascript
var myValue = ko.observable(1.223123).extend({numeric: 1});
```

## Transitions

**fadeVisible** - the same as visible, except that it fades the element in and out
```
<div data-bind="fadeVisible: showFadeText">TEST</div>
<a href="#" class="btn" data-bind="click: fadeToggle">Fade In/Out</a>
```