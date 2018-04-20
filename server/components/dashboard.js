import { Mongo } from "meteor/mongo";
import { Meteor } from "meteor/meteor";

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
});
