
import { open_dialog_delete_confirm } from '/imports/functions/common';

Template.menu_list.onCreated(function() {
  this.user_menus = this.subscribe('getListMenus');
})

Template.menu_list.onRendered(function() {
  this.$('select').material_select();
})

Template.menu_list.helpers({
  'user_menus': function() {
    var current_user = Meteor.userId();
    var user_menus = Menu.find({"user_id": current_user, "deleted": false}).fetch();
    user_menus.map((item, index) => {
      // item.menu_selling_price = Math.round(item.menu_selling_price / 1.15).toFixed(2)
      item.menu_selling_price = parseFloat(item.menu_selling_price / 1.15).toFixed(2);
    })
    return user_menus;
  },
  'subscription': function() {
    return Template.instance().user_menus.ready();
  },
  'checkbox_id': function() {
    var checkbox_id = Template.instance().view.parentView.name + "_" + this._id;
    return checkbox_id;
  },
  'check_menu': function() {
    Meteor.call('checkAlreadyMenu', function(err, result){
      if (err) {
        return false;
      } else {
        return true;
      }
    })
  }
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

    open_dialog_delete_confirm("Are you sure?", "Are you sure to delete this menu?", () => {},() => {

      Meteor.call('menu.delete', sessionStorage.getItem("deletedMenuID"));
      sessionStorage.clear();
    });
    sessionStorage.setItem("deletedMenuID", this._id);
  },
  'click #edit_menu': function() {
    $('#edit_menu_modal').modal('open')
    var menu_tags = this.menu_tags;
    $('#edit_menu_tags').material_chip({data: menu_tags});
    Session.set('menu_tags', this.menu_tags);
    Session.set('menu_id', this._id);
    Session.set('dishes_id', this.dishes_id);
  }
})
