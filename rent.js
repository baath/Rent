/* Jquery */
loadScript('https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js');
/*Google Maps */
loadScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyBY9dLsaxixLWSQlwRvgaFvr3lfDUhxt1M&signed_in=true&&libraries=places&callback=initAutocomplete');
function loadScript(scriptLocationAndName) {
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = scriptLocationAndName;
    head.appendChild(script);
}


// This example adds a search box to a map, using the Google Place Autocomplete
// feature. People can enter geographical searches. The search box will return a
// pick list containing a mix of places and predicted search terms.
var map;
var markers = [];
var infowindows = [];
function initAutocomplete() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 43.656555, lng: -79.739151},
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        zoomControl: true,
        scaleControl: true
    });
    geocoder = new google.maps.Geocoder();
    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function () {
        searchBox.setBounds(map.getBounds());
    });


    // [START region_getplaces]
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function () {
        var places = searchBox.getPlaces();

        if (places.length == 0) {
            return;
        }

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function (place) {
            var icon = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            markers.push(new google.maps.Marker({
                map: map,
                icon: icon,
                title: place.name,
                position: place.geometry.location
            }));

            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });
        map.fitBounds(bounds);
    });
    // [END region_getplaces]
}
var key;
setTimeout(function mark() {
    $.getJSON("rent.json")
        .done(function (data) {
            var request = document.createElement('div');
            request.title = 'Add';
            request.innerHTML = '<a href="request" rel="prefetch"><img src="images/request.png" alt="Submit a Request" width="30%"/></a>';
            request.index = 50;
            map.controls[google.maps.ControlPosition.LEFT].push(request);


            for (key in data) {
                var address = data[key].address;
                var lt = data[key].lat;
                var lg = data[key].lng;
                var type = data[key].type;
                var parking = data[key].parking;
                var utilities = data[key].utilities;
                var require = data[key].require;
                var cost = data[key].cost;
                var contact = data[key].contact;
                var phone = data[key].phone;
                var email = data[key].email;
                var website = data[key].website;

                infowindows[key] = new google.maps.InfoWindow({
                    content: '<ul style="list-style-type: none; text-align: left">' +
                    '<li><b>Address</b>: ' + address + '</li>' +
                    '<li><b>Type</b>: ' + type + '</li>' +
                    '<li><b>Parking</b>: ' + parking + '</li>' +
                    '<li><b>Utilities</b>: ' + utilities + '</li>' +
                    '<li><b>Requirements</b>: ' + require + '</li>' +
                    '<li><b>Cost</b>: $' + cost + '/month</li>' +
                    '<li><b>Contact</b>: ' + contact + '</li>' +
                    '<li><a href=\'tel:' + phone + '\'><svg fill=\'#000000\' height=\'24\' viewBox=\'0 0 24 24\'width=\'24\' xmlns=\'http://www.w3.org/2000/svg\'> <path d=\'M0 0h24v24H0z\' fill=\'none\'/><path d=\'M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z\'/> </svg></a>' +
                    '<a href=\'mailto:' + email + '\' target=\'_top\'><svg fill=\'#000000\' height=\'24\' viewBox=\'0 0 24 24\' width=\'24\' xmlns=\'http://www.w3.org/2000/svg\'> <path d=\'M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z\'/> <path d=\'M0 0h24v24H0z\' fill=\'none\'/> </svg></a>' +
                    '<a href=\'' + website + '\' target=\'_blank\' rel=\'external\'><svg fill=\'#000000\' height=\'24\' viewBox=\'0 0 24 24\' width=\'24\' xmlns=\'http://www.w3.org/2000/svg\'> <path d=\'M0 0h24v24H0z\' fill=\'none\'/> <path d=\'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z\'/></svg></a></li>' +
                    '</ul>'
                });
                marker(address, lt, lg, key);
            }

        })
        .fail(function (jqxhr, textStatus, error) {
            var err = textStatus + ", " + error;
            console.log("Request Failed to the Database: " + err);
        });
}, 1000);

function marker(address, lt, lg, key) {
    var icon = {
        url: 'images/house.png',
        size: new google.maps.Size(50, 50),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
    };
    markers[key] = new google.maps.Marker({
        position: {lat: lt, lng: lg},
        map: map,
        title: address,
        icon: icon,
        draggable: false,
        animation: google.maps.Animation.DROP
    });
    markers.push(markers[key]);
    google.maps.event.addListener(markers[key], 'click', function (key) {
        return function () {
            infowindows[key].open(map, markers[key]);
            setTimeout(function () {
                infowindows[key].close();
            }, 30000);
        }
    }(key));
}

function currentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            map.setCenter(pos);
        }, function () {
            console.log('Geolocation Service: Permission Not Granted');
        });
    } else {
        console.log('This browser does not support Geolocation');
    }
}