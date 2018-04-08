import {
    Meteor
} from 'meteor/meteor';

DishesViews = new Mongo.Collection('dishes_views');
MenusViews = new Mongo.Collection('menu_views');
KitchenViews = new Mongo.Collection('kitchen_views');

Meteor.methods({
  'dish.view' (dishId) {
    DishesViews.insert({
      user_id: Meteor.userId(),
      dish_id: dishId,
      createdAt: new Date()
    })
  },
  'menu.view' (menuId) {
    MenusViews.insert({
      user_id: Meteor.userId(),
      menu_id: menuId,
      createdAt: new Date()
    })
  },
  'kitchen.view' (kitchenId) {
    KitchensViews.insert({
      user_id: Meteor.userId(),
      kitchen_id: kitchenId,
      createdAt: new Date()
    })
  }
})
