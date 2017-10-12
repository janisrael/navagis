
var map;
var posi = new google.maps.LatLng(10.309235, 123.895130);
var bounds = null;

// add marker to object



// var name = 'Neo Neo Grill House';

var locations =[
  {
        "id": 0,
        "name": "Neo Neo Grill House",
        "Categorie": "finedining",
        "specialty": "Sisig",
        "lat": 10.309235,
        "lng": 123.895130,
        "state": 'Online',
        "position": posi,
        "selected": false

    },

      {
        "id": 1,
        "name": "Ipars Restaurant",
        "Categorie": "finedining",
        "specialty": "Beef Loaf",
        "lat": 10.305576,
        "lng": 123.897891,
        "selected": false
    },
    {
        "id": 2,
        "name": "Zubuchon",
        "Categorie": "grill",
        "specialty": "Lechon Baboy",
        "lat": 10.310246,
        "lng": 123.896512,
        "state": 'Online',
        "position": posi,
        "selected": false
    },
    {
        "id": 3,
        "name": "Angelica Bakeshop",
        "Categorie": "bakeshop",
        "specialty": "SliceBread",
        "lat": 10.305412,
        "lng": 123.894933,
        "state": 'Online',
        "position": posi,
        "selected": false
    }
 ]


function initialize() {
    var selecting = false;
    $("#btn").click(function(){
        selecting = true;
        $("#btn").css("color","red");
        $(".drag-ins").css("visibility","visible");
    });
    var mapOptions = {
        zoom: 16,
        center: new google.maps.LatLng(10.309235, 123.895130),
        mapTypeId: google.maps.MapTypeId.TERRAIN
    };
    markers = [];

    map = new google.maps.Map(document.getElementById('map'), mapOptions);
    var infowindow = new google.maps.InfoWindow();
    for (var key in locations) {
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(locations[key].lat, locations[key].lng),

            map: map
        });
        locations[key].marker = marker;

        google.maps.event.addListener(marker, 'click', (function (marker, key) {
            return function () {
                infowindow.setContent(locations[key].name);
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
                gribBoundingBox.setBounds(newbounds); 

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
                
                for (var key in locations) { // looping through my Markers Collection	

//                    if (boundsSelectionArea.contains(markers[key].marker.getPosition())) 
                    if (gribBoundingBox.getBounds().contains(locations[key].marker.getPosition())) 
                    {
                        //if(flashMovie !== null && flashMovie !== undefined) {
                        locations[key].marker.setIcon("http://maps.google.com/mapfiles/ms/icons/blue.png")
			document.getElementById('info').innerHTML += "<div class='items'><div class='res-name'> Name:"+locations[key].name+ "</div><div class='specialty'> Specialty:"+locations[key].specialty + "</div><div class='type'>category:" +locations[key].Categorie +"</div><button>get direction</button></div>" ;

              
                    } else {
                        //unselected markers
                        //if(flashMovie !== null && flashMovie !== undefined) {
            //             markers[key].marker.setIcon("http://maps.google.com/mapfiles/ms/icons/red.png")
			// document.getElementById('info').innerHTML += "key:"+key+" posn:"+markers[key].marker.getPosition()+" out of bnds:"+gribBoundingBox.getBounds()+"<br>";
                        // console.log("User NOT selected:" + key + ", id:" + markers[key].id);
                        //} 
                    }
                }

                gribBoundingBox.setMap(null); // remove the rectangle
            }
            gribBoundingBox = null;
            selecting = false;
            $("#btn").css("color","black");
             $(".drag-ins").css("visibility","hidden");
        }

        themap.setOptions({
            draggable: true
        });
        //stopDraw(e);
    });


}







