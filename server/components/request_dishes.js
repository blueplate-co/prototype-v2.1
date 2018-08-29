import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email'

RequestDishes = new Mongo.Collection("request_dishes");

Meteor.methods({

    'requestdish.insert' (dishId, buyerId, sellerId) {
        RequestDishes.insert({
            dish_id: dishId,
            seller_id: sellerId,
            buyer_id: buyerId,
            sent_notification: false,
            createdAt: new Date()
        });
    },

    'requestdish.find_dish_notification' (dishId) {
        return RequestDishes.findOne({ dish_id: dishId, sent_notification: false});
    },

    'requestdish.update' (requestId) {
        RequestDishes.update(
            { _id: requestId },
            { $set: {
                sent_notification: true,
                updateAt: new Date()
            }}
        )
    },

    'requestdish.sendEmail'(to, from, subject, text) {
        check([to, from, subject, text], [String]);
        this.unblock();
        Email.send({ to, from, subject, text });
        console.log("sent email");
    },

    'requestdish.find_dish_request' (dishId, buyerId) {
        return RequestDishes.findOne({ dish_id: dishId, buyer_id: buyerId, sent_notification: false});
    },
});