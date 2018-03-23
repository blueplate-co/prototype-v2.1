Template.menu_list.onCreated(function() {
  this.user_menus = this.subscribe('getListMenus');
})

Template.menu_list.onRendered(function() {
  this.$('select').material_select();
})

Template.menu_list.helpers({
  'user_menus': function() {
    var current_user = Meteor.userId();
    var user_menus = Menu.find({"user_id": current_user, "deleted": false});
    return user_menus;
  },
  'subscription': function() {
    return Template.instance().user_menus.ready();
  },
  'checkbox_id': function() {
    var checkbox_id = Template.instance().view.parentView.name + "_" + this._id;
    return checkbox_id;
  },
})

Template.menu_list.events({
  'change .menus_checkbox': function(event, template) {
    var checked_menus = template.findAll("input[class=menus_checkbox]:checked")
    var checked_values = checked_menus.map(function(selection){
      return selection.value;
    });
    Session.set('selected_menus_id', checked_values);
  },
  'click #delete_menu': function () {
    $('#confirm_delete').modal({
        dismissible: true, // Modal can be dismissed by clicking outside of the modal
        opacity: .5, // Opacity of modal background
        inDuration: 300, // Transition in duration
        outDuration: 200, // Transition out duration
        startingTop: '4%', // Starting top style attribute
        endingTop: '10%' // Ending top style attribute
      }
    );
    $('#confirm_delete').modal('open');
    sessionStorage.setItem("deletedMenuID", this._id);
  },
  'click #confirm': function() {
    Meteor.call('menu.delete', sessionStorage.getItem("deletedMenuID"));
    sessionStorage.clear();
  },
  'click #edit_menu': function() {
    $('#edit_menu_modal').modal('open')
    Session.set('menu_id', this._id);
    Session.set('dishes_id', this.dishes_id);
  }
})
