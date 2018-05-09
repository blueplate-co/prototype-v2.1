import { Mongo } from "meteor/mongo";
import { Meteor } from "meteor/meteor";
import moment from "moment";

Meteor.methods({
  getConfig() {
    var result = Annoucement.find({}).fetch()[0];
    return result;
  },
  "dashboard.totalSales"(timeframe) {
    switch (timeframe) {
      case "week":
        var result = [];
        var userId = Meteor.userId();
        var pipeline = [
          {
            $match: {
              $and: [{ status: { $ne: "Created" } }, { seller_id: userId }],
            },
          },
          {
            $group: {
              _id: { day: { $dayOfWeek: "$createdAt" } },
              sales: { $sum: "$total_price" }
            },
          },
          {
            $sort: {
              _id: 1,
            },
          }
        ];
        result = Order_record.aggregate(pipeline);
        return result;
        break;
      case "month":
        var result = [];
        var userId = Meteor.userId();
        var pipeline = [
          {
            $match: {
              $and: [{ status: { $ne: "Created" } }, { seller_id: userId }],
            },
          },
          {
            $group: {
              _id: { day: { $dayOfMonth: "$createdAt" } },
              sales: { $sum: "$total_price" }
            },
          },
          {
            $sort: {
              _id: 1,
            },
          }
        ];
        result = Order_record.aggregate(pipeline);
        return result;
        break;
      case "year":
        var result = [];
        var userId = Meteor.userId();
        var pipeline = [
          {
            $match: {
              $and: [{ status: { $ne: "Created" } }, { seller_id: userId }],
            },
          },
          {
            $group: {
              _id: { day: { $month: "$createdAt" } },
              sales: { $sum: "$total_price" }
            },
          },
          {
            $sort: {
              _id: 1,
            },
          }
        ];
        result = Order_record.aggregate(pipeline);
        return result;
        break;
    }
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
        case "Closed":
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
  "dashboard.summarydishes"() {
    var result = [];
    // calculate id, name, orders, rating
    var dishes = Dishes.find({ user_id: Meteor.userId() }).fetch();
    for (var i = 0; i < dishes.length; i++) {
      var singleDish = {
        id: dishes[i]._id,
        name: dishes[i].dish_name,
        views: 0,
        likes: 0,
        orders: dishes[i].order_count,
        rating: Math.round(dishes[i].average_rating * 100) / 100
      };
      result.push(singleDish);
    }
    // calculate like
    for (var i = 0; i < result.length; i++) {
      var likes = DishesLikes.find({ dish_id: dishes[i].id }).count();
      result[i].likes = likes;
    }

    //calculate views
    for (var i = 0; i < result.length; i++) {
      var views = DishesViews.find({ dish_id: dishes[i].id }).count();
      result[i].views = views;
    }

    return result;
  },
  "dashboard.summarymenu"() {
    var result = [];
    var item = { id: "", name: "", views: 0, likes: 0, orders: 0, rating: 0 };
    // calculate id, name, orders, rating
    var menus = Menu.find({ user_id: Meteor.userId() }).fetch();
    for (var i = 0; i < menus.length; i++) {
      var singleMenu = {
        id: menus[i]._id,
        name: menus[i].menu_name,
        views: 0,
        likes: 0,
        orders: menus[i].order_count,
        rating: Math.round(menus[i].average_rating * 100) / 100,
      };
      result.push(singleMenu);
    }
    // calculate like
    for (var i = 0; i < result.length; i++) {
      var likes = MenusLikes.find({ menu_id: menus[i].id }).count();
      result[i].likes = likes;
    }

    //calculate views
    for (var i = 0; i < result.length; i++) {
      var views = MenusViews.find({ menu_id: menus[i].id }).count();
      result[i].views = views;
    }

    return result;
  },
  "dashboard.summaryorder"() {
    var result = [];
    // calculate id, name, orders, rating
    var orders = Order_record.find({ seller_id: Meteor.userId() }).fetch();
    for (var i = 0; i < orders.length; i++) {
      //- id
      var id = orders[i]._id;
      //- date
      var date = moment(orders[i].createdAt).format("DD/MM/YYYY");
      //- name
      var name = "";
      if (Dishes.find({ _id: orders[i].product_id }).fetch().length > 0) {
        name = Dishes.find({
          _id: orders[i].product_id,
        }).fetch()[0].dish_name;
      } else {
        name = Menu.find({
          _id: orders[i].product_id,
        }).fetch()[0].menu_name;
      }
      //- foodie
      var foodie = Profile_details.find({
        user_id: orders[i].buyer_id,
      }).fetch()[0].foodie_name;
      //- status
      var status = orders[i].status;
      //- amount
      var amount = Math.round(orders[i].total_price / 1.15);
      singleOrder = {
        id: id,
        date: date,
        name: name,
        foodie: foodie,
        status: status,
        amount: amount,
      };
      result.push(singleOrder);
    }

    return result;
  },
  "dashboard.topselling"() {
    var dishes = Dishes.find(
      { user_id: Meteor.userId() },
      { sort: { order_count: -1 }, limit: 5 }
    ).fetch();
    return dishes;
  },
  "dashboard.totalsalesData"(timeframe) {
    switch (timeframe) {
      case "week":
        var result = [];
        var userId = Meteor.userId();
        var pipeline = [
          {
            $match: {
              $and: [{ status: { $ne: "Created" } }, { seller_id: userId }],
            },
          },
          {
            $group: {
              _id: { day: { $dayOfWeek: "$createdAt" } },
              sales: { $sum: "$total_price" },
            },
          },
          {
            $sort: {
              _id: 1,
            },
          },
        ];
        result = Order_record.aggregate(pipeline);
        return result;
        break;
      case "month":
        var result = [];
        var userId = Meteor.userId();
        var pipeline = [
          {
            $match: {
              $and: [{ status: { $ne: "Created" } }, { seller_id: userId }],
            },
          },
          {
            $group: {
              _id: { day: { $dayOfMonth: "$createdAt" } },
              sales: { $sum: "$total_price" },
            },
          },
          {
            $sort: {
              _id: 1,
            },
          },
        ];
        result = Order_record.aggregate(pipeline);
        return result;
        break;
      case "year":
        var result = [];
        var userId = Meteor.userId();
        var pipeline = [
          {
            $match: {
              $and: [{ status: { $ne: "Created" } }, { seller_id: userId }],
            },
          },
          {
            $group: {
              _id: { day: { $month: "$createdAt" } },
              sales: { $sum: "$total_price" },
            },
          },
          {
            $sort: {
              _id: 1,
            },
          },
        ];
        result = Order_record.aggregate(pipeline);
        return result;
        break;
    }
  },
});
