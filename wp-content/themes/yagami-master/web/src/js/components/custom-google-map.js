/*
|--------------------------------------------------------------------------------
|                                  Custom Google Map
|--------------------------------------------------------------------------------
|
| Scroller is a lightweight library to manage "animated & looped" sliding contents
| It uses Greensock as main dependency
|
*/

/*
|
| Class
|--------
|
*/
class customGoogleMap {
    /*
    |
    | Constructor
    |--------------
    */
    constructor($map, params) {
        this.map = $map;
        this.params = params;
        this.init();
    }

    /*
    |
    | init
    |-------
    */
    init() {
        var _this = this;
        var map = new google.maps.Map(_this.map[0], {
            zoom: 1,
            scrollwheel: false,
            center: new google.maps.LatLng(0, 0),
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            styles: this.getCustomization()
        });

        map.markers = [];

        $.each(this.params.markers, function () {
            _this.add_marker($(this), map);
        });
        _this.center_map(map);

        return map;
    }

    /*
    |
    | add_marker
    |-------------
    */
    add_marker($marker, map) {
        var latlng = new google.maps.LatLng($marker.data('lat'), $marker.data('lng'));

        var icon = {
            url: $marker.data('icon'),
            scaledSize: new google.maps.Size(60, 60),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(0, 0)
        };

        var marker = new google.maps.Marker({
            position: latlng,
            map: map,
            icon: icon
        });

        map.markers.push(marker);

        if ($marker.html()) {
            var infowindow = new google.maps.InfoWindow({
                content: '<div class="map-card">' + $marker.html() + '</div>'
            });

            google.maps.event.addListener(marker, 'click', function () {
                infowindow.open(map, marker);
            });
        }
    }

    /*
    |
    | center_map
    |-------------
    */
    center_map(map) {
        var bounds = new google.maps.LatLngBounds();

        $.each(map.markers, function (i, marker) {
            var latlng = new google.maps.LatLng(marker.position.lat(), marker.position.lng());

            bounds.extend(latlng);
        });

        if (map.markers.length == 1) {
            map.setCenter(bounds.getCenter());
            map.setZoom(this.params.zoom);
        } else {
            map.fitBounds(bounds);
        }

    }

    /*
    |
    | getCustomization
    |-------------------
    */
    getCustomization() {
        return [{
                "elementType": "geometry",
                "stylers": [{
                    "color": "#f5f5f5"
                }]
            },
            {
                "elementType": "labels.icon",
                "stylers": [{
                    "visibility": "off"
                }]
            },
            {
                "elementType": "labels.text.fill",
                "stylers": [{
                    "color": "#616161"
                }]
            },
            {
                "elementType": "labels.text.stroke",
                "stylers": [{
                    "color": "#f5f5f5"
                }]
            },
            {
                "featureType": "administrative.land_parcel",
                "elementType": "labels.text.fill",
                "stylers": [{
                    "color": "#bdbdbd"
                }]
            },
            {
                "featureType": "poi",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#eeeeee"
                }]
            },
            {
                "featureType": "poi",
                "elementType": "labels.text.fill",
                "stylers": [{
                    "color": "#757575"
                }]
            },
            {
                "featureType": "poi.park",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#e5e5e5"
                }]
            },
            {
                "featureType": "poi.park",
                "elementType": "labels.text.fill",
                "stylers": [{
                    "color": "#9e9e9e"
                }]
            },
            {
                "featureType": "road",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#ffffff"
                }]
            },
            {
                "featureType": "road.arterial",
                "elementType": "labels.text.fill",
                "stylers": [{
                    "color": "#757575"
                }]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#dadada"
                }]
            },
            {
                "featureType": "road.highway",
                "elementType": "labels.text.fill",
                "stylers": [{
                    "color": "#616161"
                }]
            },
            {
                "featureType": "road.local",
                "elementType": "labels.text.fill",
                "stylers": [{
                    "color": "#9e9e9e"
                }]
            },
            {
                "featureType": "transit.line",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#e5e5e5"
                }]
            },
            {
                "featureType": "transit.station",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#eeeeee"
                }]
            },
            {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#c9c9c9"
                }]
            },
            {
                "featureType": "water",
                "elementType": "labels.text.fill",
                "stylers": [{
                    "color": "#9e9e9e"
                }]
            }
        ]
    }
}

export default customGoogleMap;