import { Blaze } from 'meteor/blaze';
import { Meteor } from 'meteor/meteor';

kitchen_marker = []; //define a global marker array to administrate pin locations of kitchens on google map
marker = [];

Template.mapping.helpers({
  'map_options': function() {
  // initial setting of when google map is loaded, set center and zoom range
    if (GoogleMaps.loaded()) {
      return {
        center: new google.maps.LatLng(22.3964, 114.1095),
        zoom: 11,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false
      };
    }
  }
});

Template.location_search_card.helpers({
  'address':function() {
    var address = Session.get('address');
    if (typeof address === "undefined") {
      return "Search your location here";
    } else {
      return address;
    }
  }
});

Template.location_search_card.events({
  'keypress .input-field': function (event) {
    // collect address from search panel and pass to geocoder using Session
    if (event.which === 13) {
      var address = document.getElementById('location_search_input').value;
      Session.set('address', address);
      try {
        Blaze.remove(Template.instance().view);
      }
      catch (err) {
        return false;
      }
    }
  }
});

Template.mapcard.onRendered(function(){
  Blaze.render(Template.mapping, $('#location_search_card')[0]);
  // using blaze to render the template everytime preventing google map
  // having partial grey area when rerendered
});

Template.mapping.onRendered(function(){
  GoogleMaps.ready('Map_location', function(map) {
  // Define markers properties when google map is created. pointer didn't specify
  // as we will obtain current location later on
  marker = new google.maps.Marker({
    draggable: true,
    animation: google.maps.Animation.DROP,
    zoom: 15
  });

  // Reactive markers on google map to reflect search results
  Tracker.autorun(function() {
    if (!Session.get('address') || Session.get('address').length < 1 || Session.get('address') === "") {
      console.log('no address');
      //return to default position
      marker.setMap(null);
      map.instance.setCenter(new google.maps.LatLng(22.3964, 114.1095));
      map.instance.setZoom(10);
    }
    try {
      var kitchen_details = Session.get('searched_result');
      console.log(kitchen_details);
    }
    catch (err) {
      //console.log(err);
      for (i=0; i< kitchen_marker.length; i++) {
        kitchen_marker[i].setMap(null);
      }
      return true;
    }
    console.log(kitchen_marker);
    if (kitchen_marker.length > 0) {
      console.log('have markers');
      for (i=0; i < kitchen_marker.length; i++) {
        kitchen_marker[i].setMap(null);
      }
      kitchen_marker = [];
    } else {
      console.log('no markers');
      for (i=0; i < kitchen_marker.length; i++) {
        kitchen_marker[i].setMap(null);
      }
    }
    console.log('total kitchens display on map:' + kitchen_details.length);
    for (i=0; i < kitchen_details.length; i++) {
      //console.log(kitchen_details[i].kitchen_address_conversion.lat)
      kitchen_marker[i] = new google.maps.Marker({
        position: {
          lat: kitchen_details[i].kitchen_address_conversion.lat,
          lng: kitchen_details[i].kitchen_address_conversion.lng
        },
        animation: google.maps.Animation.DROP,
        title: String(kitchen_details[i].kitchen_name),
        kitchen_id: kitchen_details[i]._id
      })
      kitchen_marker[i].setMap(map.instance);
    }
  });

  var geocoder = new google.maps.Geocoder(); //Define new geocoder of the map

  // Add event listener to get marker info after drag finish, using "event.latlng"
  google.maps.event.addListener(this.marker, 'dragend', function(event) {
    marker_position = event.latLng;
    // User geocoder to reverse geocoding to obtain aaddress, with error checking
    geocoder.geocode({'location': marker_position}, function(results, status){
      if (status === 'OK') {
        if (results[0]) {
          var address = results[0].formatted_address;
          Session.set('address', address);
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }
    });
  });
});
  // Set autorun of the code after template is created
  // get address from Session above to look for the location using geo code
  // set map center and marker on position found
  var self = this;
  GoogleMaps.ready('Map_location', function(map) {
      var geocoder = new google.maps.Geocoder();
    self.autorun(function(){
      geocoder.geocode({'address': Session.get('address')}, function(results,status) {
        if(status == 'OK') {
          map.instance.setCenter(results[0].geometry.location);
          marker.setMap(map.instance);
          marker.setPosition(results[0].geometry.location);
          map.instance.setZoom(15);
        }
      });
    });
  });
});
