/*
// this was designed to work with data from a specific project.
// will need some customising to work with something else.

to use -
<div data-bind="map: mapObject"></div>


var mapObject = new Mapping.Map();
mapObject.items.push(new Mapping.Track());

*/
(function (window, ko, google) {
    if (typeof window === 'undefined' || typeof ko === 'undefined' || typeof google === 'undefined')
		return;
	
    window.Mapping = window.Mapping || {};

	ko.bindingHandlers.map = {
	    init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
	        var value = ko.utils.unwrapObservable(valueAccessor()),
                map;

	        map = value.createGmap(element);
	    },
	    update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
	    }
	};


	function Map(options, items) {
	    var self = this,
            /** The map center latitude */
            centerLat = ko.observable(0),
            /** The map center longitude */
            centerLng = ko.observable(0),
            /** The map zoom level */
            zoomLevel = ko.observable(3),
            /** The items that should be mapped */
            mapItems = ko.isObservable(items) ? items : ko.observableArray(items),
            /** The items that are currently on the map */
            mappedItems = [];

	    self._getMappedItems = function () { return mappedItems; };

	    if (options) {
	        centerLat(options.lat || 0);
	        centerLng(options.lng || 0);
	        zoomLevel(options.zoom || 3);
	    }

	    self.map = null;
	    self.center = {
	        lat: centerLat,
	        lng: centerLng
	    };
	    self.zoom = zoomLevel;
	    self.items = mapItems;

	    centerLat.subscribe(function (newLat) {
	        if (self.map) {
	            self.map.setCenter(createGmapsLocation(newLat, centerLng()));
	        }
	    });
	    centerLng.subscribe(function (newLng) {
	        if (self.map) {
	            self.map.setCenter(createGmapsLocation(centerLat(), newLng));
	        }
	    });
	    zoomLevel.subscribe(function (newZoom) {
	        if (self.map) {
	            self.map.setZoom(newZoom);
	        }
	    });
	    mapItems.subscribe(function (updatedItems) {
	        // get a list of what needs to be added or removed from the map
	        var differences = ko.utils.compareArrays(mappedItems, updatedItems),
                item;

	        for (var i = 0; i < differences.length; i++) {
	            item = differences[i];
	            switch (item.status) {
	                case 'added':
	                    item.value.addToMap(self.map);
	                    mappedItems.push(item.value);
	                    break;
	                case 'deleted':
	                    item.value.removeFromMap();
	                    var index = mappedItems.indexOf(item.value);
	                    mappedItems.splice(index, 1);
	                    break;
	                default:
	            }
	            //if (item.value instanceof Marker) {
	            //} else if (item.value instanceof Track) {
	            //}
	        }
	    });
	}

	Map.prototype.createGmap = function (element) {
	    var mapOptions = {
	        zoom: this.zoom(),
	        center: createGmapsLocation(
                ko.utils.unwrapObservable(this.center.lat),
                ko.utils.unwrapObservable(this.center.lng)),
	        mapTypeId: google.maps.MapTypeId.ROADMAP
	    },
            items = this.items();
	    this.map = new google.maps.Map(element, mapOptions);

	    var mappedItems = this._getMappedItems();
	    for (var i = 0; i < items.length; i++) {
	        items[i].addToMap(this.map);
	        mappedItems.push(items[i]);
	    }
	    return this.map;
	};

	Map.prototype.fix = function () {
	    if (this.map) {
	        google.maps.event.trigger(this.map, 'resize');
	    }
	};

	function Track(mapData, title, color, thickness, opacity) {
	    var self = this,
            gmapsObjects = null;

	    self.points = typeof mapData.path !== 'undefined' ? mapData.path : mapData;
	    self.pois = typeof mapData.pois !== 'undefined' ? mapData.pois : [];
	    self.color = color || '#ff0000';
	    self.thickness = thickness || 4;
	    self.opacity = opacity || 0.8;
	    self.title = title || 'Track';

	    self._getGmapsObjects = function () {
	        if (gmapsObjects == null) {
	            gmapsObjects = [];
	            if (self.points && self.points.length > 0) {
	                var firstPoint = self.points[0];
	                var lastPoint = self.points[self.points.length - 1];
	                gmapsObjects.push(createGmapsPolyline(self));
	                gmapsObjects.push(createGmapsMarker(new Marker(firstPoint[0], firstPoint[1], 'Start - ' + self.title)));
	                gmapsObjects.push(createGmapsMarker(new Marker(lastPoint[0], lastPoint[1], 'Finish - ' + self.title)));
	            }
	        }
	        return gmapsObjects;
	    };
	    self._disposeGmapsObjects = function () {
	        if (gmapsObjects) {
	            delete gmapsObjects;
	            gmapsObjects = null;
	        }
	    };
	}
	Track.prototype.addToMap = function (map) {
	    var objects = this._getGmapsObjects();
	    for (var i = 0; i < objects.length; i++) {
	        objects[i].setMap(map);
	    }
	};
	Track.prototype.hideFromMap = function () {
	    var objects = this._getGmapsObjects();
	    for (var i = 0; i < objects.length; i++) {
	        objects[i].setMap(null);
	    }
	};
	Track.prototype.removeFromMap = function () {
	    this.hideFromMap();
	    this._disposeGmapsObjects();
	};


	function Marker(lat, lng, title, markerImage) {
	    var self = this,
            gmapsMarker = null;
	    self.lat = lat;
	    self.lng = lng;
	    self.title = title || 'Title';
	    if (markerImage) self.markerImage = markerImage;
	    self._getGmapsMarker = function () {
	        if (gmapsMarker == null) {
	            gmapsMarker = createGmapsMarker(self);
	        }
	        return gmapsMarker;
	    };
	    self._disposeGmapsMarker = function () {
	        if (gmapsMarker) {
	            delete gmapsMarker;
	            gmapsMarker = null;
	        }
	    };
	}
	Marker.prototype.addToMap = function (map) {
	    var marker = this._getGmapsMarker();
	    marker.setMap(map);
	};
	Marker.prototype.hideFromMap = function () {
	    var marker = this._getGmapsMarker();
	    marker.setMap(null);
	};
	Marker.prototype.removeFromMap = function () {
	    this.hideFromMap();
	    this._disposeGmapsMarker();
	};

	function createGmapsLocation(lat, lng) {
	    return new google.maps.LatLng(lat, lng);
	}

	function createGmapsMarker(marker, map) {
	    return new google.maps.Marker({
	        position: createGmapsLocation(marker.lat, marker.lng),
	        map: map || null,
	        draggable: false,
	        title: marker.title,
	        animation: google.maps.Animation.DROP,
	        icon: marker.markerImage,
	    });
	}

	function createGmapsPolyline(track, map) {
	    var path = [];
	    for (var i = 0; i < track.points.length; i++) {
	        path.push(createGmapsLocation(track.points[i][0], track.points[i][1]));
	    }
	    var line = new google.maps.Polyline({
	        path: path,
	        strokeColor: track.color,
	        strokeOpacity: track.opacity,
	        strokeWeight: track.thickness
	    });
	    if (map)
	        line.setMap(map);
	    return line;
	}

	Mapping.Map = Map;
	Mapping.Track = Track;
	Mapping.Marker = Marker;

	return Mapping;
})(window, ko, google);
