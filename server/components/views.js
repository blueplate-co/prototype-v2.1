import {
    Meteor
} from 'meteor/meteor';

DishesViews = new Mongo.Collection('dishes_views');
MenusViews = new Mongo.Collection('menu_views');
KitchenViews = new Mongo.Collection('kitchen_views');

Meteor.methods({
  'dish.view' (dishId, sellerId) {
    DishesViews.insert({
      viewer_id: Meteor.userId(),
      seller_id: sellerId,
      dish_id: dishId,
      createdAt: new Date()
    })
  },
  'menu.view' (menuId, sellerId) {
    MenusViews.insert({
      viewer_id: Meteor.userId(),
      seller_id: sellerId,
      menu_id: menuId,
      createdAt: new Date()
    })
  },
  'kitchen.view' (kitchenId, sellerId) {
    KitchenViews.insert({
      viewer_id: Meteor.userId(),
      seller_id: sellerId,
      kitchen_id: kitchenId,
      createdAt: new Date()
    })
  },
  'total.views' () {
    return DishesViews.find({seller_id: Meteor.userId()}).count() + MenusViews.find({seller_id: Meteor.userId()}).count() + KitchenViews.find({seller_id: Meteor.userId()}).count();
  },
  'dish.total_view'(date) {
    return DishesViews.find({createdAt:{ $gt: date}}).fetch();
  },
  'menu.total_view'(date, seller_id) {
    return MenusViews.find({createdAt:{ $gt: date}}).fetch();
  }
})

Meteor.publish('dishesViews', function() {
  return DishesViews.find({seller_id: Meteor.userId()})
})
Meteor.publish('menusViews', function() {
  return MenusViews.find({seller_id: Meteor.userId()})
})
Meteor.publish('kitchenViews', function() {
  return KitchenViews.find({seller_id: Meteor.userId()})
})
