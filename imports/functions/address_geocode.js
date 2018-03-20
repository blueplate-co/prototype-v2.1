export function address_geocode(name, address, string) {
  //name - is used to store as the Session name
  //address - the address to be geocoded
  //string - the description that is used in error message
  // This function converts an address into lattitude and longitude, which will stored
  // in a session with the name given from you

  var geocoder = new google.maps.Geocoder();
  if (address) {
    geocoder.geocode({'address': String(address)}, function(results,status){
      if (status == 'OK') {
        var latlng = [];
        var latlng = {
          lng: results[0].geometry.location.lng(),
          lat: results[0].geometry.location.lat()
        };
        Session.set(name, latlng);
      } else {
        Materialize.toast('Ops... Looks like the ' + string + ' provided is incorrect, please double check!', 4000, "rounded red lighten-2")
      }
    });
  }
}
