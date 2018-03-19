Template.location.helpers({

/* A collection should be created for address that link
with user accounts */
  location: [
    {name: 'Home', id: 'home', address: '92 Bauhinia Road, Fairview Park'},
    {name: 'Office', id: 'office', address: 'Room 803, 8/F, Lai Cheong Factory Building, 479 Castle Peak Road, Lai Chi Kok, Kowloon, Hong Kong'},
    {name: 'Map', id:'map', address:'Tung Fat Building, Yuen Long'},
  ],
});

Template.location.onRendered(function(){
  this.$('.modal').modal();
});

Template.selection.helpers({
/* These 2 helpers are created to highlight and change
properties of the selected card */

  'selection_elements': function() {
    var location_id = this.address;
    var selected_location = Session.get('selected_location');
    if (location_id == selected_location) {
    return "bp-green"
  }
},
  'selection_text': function() {
    var location_id = this.address;
    var selected_location = Session.get('selected_location');
    if (location_id == selected_location) {
    return "white-text"
  }
}
});

Template.selection.events ({
  'click .selection':function(events, template) {
    var location_id = this.address;
    Session.set('selected_location', location_id);
  }
});
