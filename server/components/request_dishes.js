import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email'
import { Accounts } from 'meteor/accounts-base';

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
        return RequestDishes.find({ dish_id: dishId, sent_notification: false}).fetch();
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
        from === '' ? from = 'account.admin@blueplate.co' : from;
        subject === '' ? subject = 'blueplate.co!' : subject;
        
        check([to, from, subject, text], [String]);
        this.unblock();
        Email.send({ to, from, subject, text });
        console.log("sent email content: " + text);
    },

    'requestdish.find_dish_request' (dishId, buyerId) {
        return RequestDishes.findOne({ dish_id: dishId, buyer_id: buyerId, sent_notification: false});
    },
    'dish.send_welcome_email'(userId, content) {
        Accounts.emailTemplates.resetPassword = {
            subject(user) {
                return "Blueplate.co - Welcome";
            },
            text(user, url) {
                let urlWithoutHash = url.replace('#/', ''),
                emailBody = content + `\n\t${urlWithoutHash}\n\nBest regards,\nAlan Anderson`;
                console.log(urlWithoutHash)
                return emailBody;
            }
        }
        Accounts.sendResetPasswordEmail(userId);
    }
});