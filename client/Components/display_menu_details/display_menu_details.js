import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';

Template.display_menu_details.onRendered(function(){
  $('.carousel').carousel({
    dist: 0,
    shift: 20
  });
  Blaze.render(Template.dishes_card,$('.menu_dish_card_wrapper')[0]);
  var menu_id = Menu.findOne({_id:Session.get('menu_id')});
  var first_dish = menu_id.dishes_id[0];
  Session.set('dish_id',first_dish);
  if ($('.menu_dish_card_wrapper #dish_card_action')) {
    $('.menu_dish_card_wrapper #dish_card_action').remove();
  }
  $('.dish_card_large').addClass('z-depth-0');
  $('.dish_card_large').css("height", "393px");
  $('.price_tag').detach();
  $('#dish_card_large .card-content h5').replaceWith(function(){
    return '<h6>'+$(this).html()+'</h6>';
  })
});

Template.display_menu_details.helpers({
  'menu_details': function() {
    var menu_id = Session.get('menu_id');
    return menu_details = Menu.findOne({_id: menu_id});
  },

  'image_details': function() {
    var image_id = String(this)
    return Images.find({_id: image_id});
  }
});

Template.display_menu_details.events({
  'click .menu_dishes_images': function(event) {
    image_id = event.target.id;
    dish_info = Dishes.findOne({image_id: image_id});
    dish_id = dish_info._id;
    Session.set('dish_id', dish_id);
  },
  'click #menu_confirm_order': function(event) {
    var menu_details = Menu.findOne({"_id":this._id});
    var foodie_details = Profile_details.findOne({"user_id": Meteor.userId()});
    var foodie_id = Meteor.userId();

    var homecook_id = menu_details.user_id;
    var homecook_details = Kitchen_details.findOne({"user_id": homecook_id});
    var foodie_name = foodie_details.foodie_name;
    var homecook_name =  homecook_details.chef_name;
    var menu_id = menu_details._id;
    var menu_price = menu_details.menu_selling_price;
    var menu_name = menu_details.menu_name;
    var ready_time = parseInt(menu_details.lead_days) * 24 * 60 + parseInt(menu_details.lead_hours) * 60;
    var quantity = menu_details.min_order;


    var serving_option = Session.get('method')
    var address = Session.get('address')
    //check if the dish has been put in shopping check_shopping_cart
    var order = Shopping_cart.findOne({"product_id":this._id, 'buyer_id':foodie_id});
    var total_price_per_dish = 0;

    if (order)
    {
      var order_id = order._id;
      quantity = parseInt(order.quantity) + 1;
      total_price_per_dish = parseInt(menu_price) * quantity
      Meteor.call('shopping_cart.update',
      order_id,
      quantity,
      total_price_per_dish,
      function(err) {
        if (err) Materialize.toast('Oops! Error when update your shopping cart. Please try again. ' + err.message, 4000, 'rounded red lighten-2');
      }
    )
    }
    else{
      Meteor.call('shopping_cart.insert',
      foodie_id,
      homecook_id,
      foodie_name,
      homecook_name,
      address,
      serving_option,
      ready_time,
      menu_id,
      menu_name,
      quantity,
      menu_price,
      function(err) {
        if (err) Materialize.toast('Oops! Error when add into shopping cart. Please try again. ' + err.message, 4000, "rounded red lighten-2");
      }
      );
    }
    Materialize.toast(menu_name + ' from ' + homecook_name + ' has been added to your shopping cart.', 4000, "rounded red lighten-2")
    $('.modal').modal();
    $('.modal').modal('close');
  }
})
