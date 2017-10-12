var map;
var markers = {};
var bounds = null;
// add marker to object
var posi = new google.maps.LatLng(53.801279, -1.548567);
var name = 'Vince';
markers[name] = {};
markers[name].id = 1;
markers[name].lat = 53.801279;
markers[name].lng = -1.548567;
markers[name].state = 'Online';
markers[name].position = posi;
markers[name].selected = false;

$(document).ready(function () {
    var selecting = false;
    $("#btn").click(function(){
        selecting = true;
        $("#btn").css("color","red");
    });
    var mapOptions = {
        zoom: 5,
        center: new google.maps.LatLng(53.801279, -1.548567),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
    var infowindow = new google.maps.InfoWindow();
    for (var key in markers) {
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(markers[key].lat, markers[key].lng),
            map: map
        });
        markers[key].marker = marker;

        google.maps.event.addListener(marker, 'click', (function (marker, key) {
            return function () {
                infowindow.setContent(key);
                infowindow.open(map, marker);
            }
        })(marker, key));
    }

    // Start drag rectangle to select markers !!!!!!!!!!!!!!!!
    var shiftPressed = false;

    $(window).keydown(function (evt) {
        if (evt.which === 16) { // shift
            shiftPressed = true;
        }
    }).keyup(function (evt) {
        if (evt.which === 16) { // shift
            shiftPressed = false;
        }
    });

    var mouseDownPos, gribBoundingBox = null,
        mouseIsDown = 0;
    var themap = map;

    google.maps.event.addListener(themap, 'mousemove', function (e) {
        if (mouseIsDown && (selecting || shiftPressed|| gribBoundingBox != null) ) {
            if (gribBoundingBox !== null) // box exists
            {         
                var newbounds = new google.maps.LatLngBounds(mouseDownPos,null);
                newbounds.extend(e.latLng);    
                gribBoundingBox.setBounds(newbounds); // If this statement is enabled, I lose mouseUp events

            } else // create bounding box
            {
                 console.log("first move");
                gribBoundingBox = new google.maps.Rectangle({
                    map: themap,
                    bounds: null,
                    fillOpacity: 0.15,
                    strokeWeight: 0.9,
                    clickable: false
                });
            }
        }
    });

    google.maps.event.addListener(themap, 'mousedown', function (e) {
        if (selecting || shiftPressed) {
            mouseIsDown = 1;
            mouseDownPos = e.latLng;
            themap.setOptions({
                draggable: false
            });
        }
    });

    google.maps.event.addListener(themap, 'mouseup', function (e) {
        if (mouseIsDown && (selecting || shiftPressed|| gribBoundingBox != null)) {
            mouseIsDown = 0;
            if (gribBoundingBox !== null) // box exists
            {
                var boundsSelectionArea = new google.maps.LatLngBounds(gribBoundingBox.getBounds().getSouthWest(), gribBoundingBox.getBounds().getNorthEast());
                
                for (var key in markers) { // looping through my Markers Collection	

//                    if (boundsSelectionArea.contains(markers[key].marker.getPosition())) 
                    if (gribBoundingBox.getBounds().contains(markers[key].marker.getPosition())) 
                    {
                        //if(flashMovie !== null && flashMovie !== undefined) {
                        markers[key].marker.setIcon("http://maps.google.com/mapfiles/ms/icons/blue.png")
			document.getElementById('info').innerHTML += "key:"+key+" posn:"+markers[key].marker.getPosition()+" in bnds:"+gribBoundingBox.getBounds()+"<br>";
                        // console.log("User selected:" + key + ", id:" + markers[key].id);
                        //}   
                    } else {
                        //if(flashMovie !== null && flashMovie !== undefined) {
                        markers[key].marker.setIcon("http://maps.google.com/mapfiles/ms/icons/red.png")
			document.getElementById('info').innerHTML += "key:"+key+" posn:"+markers[key].marker.getPosition()+" out of bnds:"+gribBoundingBox.getBounds()+"<br>";
                        // console.log("User NOT selected:" + key + ", id:" + markers[key].id);
                        //} 
                    }
                }

                gribBoundingBox.setMap(null); // remove the rectangle
            }
            gribBoundingBox = null;
            selecting = false;
            $("#btn").css("color","black");
        }

        themap.setOptions({
            draggable: true
        });
        //stopDraw(e);
    });

});