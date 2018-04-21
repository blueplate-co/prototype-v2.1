import { Mongo } from "meteor/mongo";
import { Meteor } from "meteor/meteor";
import moment from 'moment';

Meteor.methods({
  "dashboard.totalSales"() {
    var result = Order_record.find({
      seller_id: Meteor.userId(),
      status: "Closed",
    }).fetch();
    var sum_dish = 0;
    var sum_menu = 0;
    result.forEach(product => {
      if (Dishes.find({ _id: product.product_id }).fetch().length > 0) {
        sum_dish = sum_dish + product.total_price;
      } else {
        sum_menu = sum_menu + product.total_price;
      }
    });
    var res = { dish: sum_dish, menu: sum_menu };
    return res;
  },
  "dashboard.salesCount"() {
    var sales = Order_record.find({
      seller_id: Meteor.userId(),
      status: "Closed",
    }).fetch().length;
    return sales;
  },
  "dashboard.ordersummary"() {
    var ownOrders = Order_record.find({
      seller_id: Meteor.userId(),
    }).fetch();
    var pending = 0;
    var confirmed = 0;
    var completed = 0;
    var rejected = 0;
    ownOrders.forEach(order => {
      switch (order.status) {
        case "Created":
          pending = pending + 1;
          break;
        case "Cooking":
          confirmed = confirmed + 1;
          break;
        case "Ready":
          completed = completed + 1;
          break;
        case "Rejected":
          rejected = rejected + 1;
          break;
      }
    });
    return {
      pending: pending,
      confirmed: confirmed,
      completed: completed,
      rejected: rejected,
    };
  },
  'dashboard.summarydishes'() {
    var result = [];
    var item = { id: "", name: "", views: 0, likes: 0, orders: 0, rating: 0 };
    // calculate id, name, orders, rating
    var dishes = Dishes.find({ user_id: Meteor.userId() }).fetch();
    dishes.forEach(dish => {
      var singleDish = item;
      singleDish.id = dish._id;
      singleDish.name = dish.dish_name;
      singleDish.orders = dish.order_count;
      singleDish.rating = dish.average_rating;
      result.push(singleDish);
    });
    // calculate like
    result.forEach(dish => {
      var likes = DishesLikes.find({ dish_id: dish.id }).count();
      dish.likes = likes;
    });

    //calculate views
    result.forEach(dish => {
      var views = DishesViews.find({ dish_id: dish.id }).count();
      dish.views = views;
    });

    return result;
  },
  'dashboard.summarymenu'() {
    var result = [];
    var item = { id: "", name: "", views: 0, likes: 0, orders: 0, rating: 0 };
    // calculate id, name, orders, rating
    var menus = Menu.find({ user_id: Meteor.userId() }).fetch();
    menus.forEach(menu => {
      var singleMenu = item;
      singleMenu.id = menu._id;
      singleMenu.name = menu.menu_name;
      singleMenu.orders = menu.order_count;
      singleMenu.rating = menu.average_rating;
      result.push(singleMenu);
    });
    // calculate like
    result.forEach(menu => {
      var likes = MenusLikes.find({ menu_id: menu.id }).count();
      menu.likes = likes;
    });

    //calculate views
    result.forEach(menu => {
      var views = MenusViews.find({ menu_id: menu.id }).count();
      menu.views = views;
    });

    return result;
  },
  'dashboard.summaryorder'() {
    var result = [];
    var item = { id: "", date: "", name: 0, foodie: 0, status: 0, amount: 0 };
    // calculate id, name, orders, rating
    var orders = Order_record.find({ seller_id: Meteor.userId() }).fetch();
    orders.forEach(order => {
      var singleOrder = item;
      //- id
      singleOrder.id = order._id;
      //- date
      singleOrder.date = moment(order.createdAt).format('DD/MM/YYYY');
      //- name
      if (Dishes.find({ _id: order.product_id }).fetch().length > 0) {
        singleOrder.name = Dishes.find({ _id: order.product_id }).fetch()[0].dish_name;
      } else {
        singleOrder.name = Menu.find({ _id: order.product_id }).fetch()[0].menu_name;
      }
      //- foodie
      singleOrder.foodie = Profile_details.find({ user_id: order.buyer_id }).fetch()[0].foodie_name;
      //- status
      singleOrder.status = order.status;
      //- amount
      singleOrder.amount = order.total_price;
      result.push(singleOrder);
    });

    return result;
  }
});
