import { Template } from 'meteor/templating';

Template.input_rating.helpers({
  'input_rating': function(event, template) {
    console.log(this.rating);
    return this.rating;
  },
  'display_rating': function(event, template) {
    return this.rating;
  }
});

Template.input_rating.events({
  'click .input_rating': function(event, template) {
    var rating = template.$('#rating').data('userrating');
    debugger
    Meteor.call('rating.insert', rating, this._id);
    Meteor.call('order_record.rating.insert', rating, this._id);
    if (Dishes.findOne({'_id': this.product_id})) {
      var dishes_details = Dishes.findOne({'_id': this.product_id});
      //console.log(dishes_details.order_count);
      //console.log(rating);
      //console.log(dishes_details.average_rating);
      //console.log(this.product_id);
      //console.log(this.seller_id);
      Meteor.call(
        'average_rating.update',
          dishes_details.order_count,
          rating,
          dishes_details.average_rating,
          this.product_id,
          this.seller_id,
          this._id,
          this.quantity
      )
    } else if (Menu.findOne({'_id': this.product_id})) {
      var menu_details = Menu.findOne({'_id': this.product_id})
      //console.log(this.quantity);
      //console.log(rating);
      //console.log(menu_details.average_rating);
      //console.log(this.product_id);
      //console.log(this.seller_id);
      Meteor.call(
        'average_rating.update',
          menu_details.order_count,
          rating,
          menu_details.average_rating,
          this.product_id,
          this.seller_id,
          this._id,
          this.quantity
      )
    }
  }
});

Template.rating_display.helpers({
  'display_rating': function(event, template) {
    return this.average_rating;
  }
});
