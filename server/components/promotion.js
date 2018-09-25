import {
    Mongo
} from 'meteor/mongo';
import {
    Meteor
} from 'meteor/meteor';

Meteor.methods({
    'promotion.insert_history'(user_id, name_of_promotion) {
        var stripe_balance = 0;
        var credits = 0;
        Meteor.call("payment.getStripeBalance", (err, response) => {
            if (!err) {
                stripe_balance = parseInt(response.account_balance) / 100;
                Meteor.call("payment.getCredits", (err, response) => {
                    if (!err) {
                        credits = response;
                        var existed_promotion_history = Promotion_history.findOne({
                            user_id: user_id
                        });
                        if (!existed_promotion_history) {
                            Promotion_history.insert({
                                user_id: Meteor.userId(),
                                balance: 50,
                                name_of_promotion: name_of_promotion,
                                createAt: new Date(),
                                user_balance: stripe_balance + credits
                            }, (err, res) => {
                                if (!err) {
                                    return 'Applied promotion program for user successful';
                                }
                            });
                        } else {
                            throw new Meteor.Error('Error', 'Promotion history already existed.');
                        }
                    }
                });
            }

            return 'Error when applied promotion for user';
        });
    },
    'promotion.check_history'() {
        if (Meteor.userId()) {
            var existed_promotion_history = Promotion_history.findOne({
                user_id: Meteor.userId()
            });
        } else {
            var existed_promotion_history = null;
        }
        return existed_promotion_history;
    },
    'promotion.update_history'(user_id, new_balance) {
        Promotion_history.update({
            user_id: user_id
        }, {
            '$set': {
                balance: new_balance,
            }
        })
    }
});