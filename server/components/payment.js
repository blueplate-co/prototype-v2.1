import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
var stripe = require("stripe")("sk_test_K51exlBQovfRkYAag2TKbzjl");

Meteor.methods({
    'payment.createCustomer'(email) {
        if (!Meteor.users.find({_id: Meteor.userId()}).fetch()[0].stripe_id) {
            var createCustomer = Meteor.wrapAsync(stripe.customers.create.bind(stripe.customers));
            var result = createCustomer({
                account_balance: 0,
                description: 'Create customer for ' + email,
                email: email
            });
            if (result) {
                //- set customer stripe id for current user
                Meteor.users.update({
                    _id: Meteor.userId()
                }, {
                    $set: {
                        'stripe_id': result.id,
                        'credits': 50
                    }
                });
                return result.id;
            }
        }
    },
    'payment.addCard'(Stripetoken) {
        var updateCustomer = Meteor.wrapAsync(stripe.customers.update.bind(stripe.customers));
        var userStripeId = Meteor.users.find({ _id: Meteor.userId() }).fetch()[0].stripe_id;
        var result = updateCustomer(userStripeId, {
            source: Stripetoken
        });
        if (result) {
            return result.id;
        }
    },
    'payment.createSource'(Stripetoken) {
        //- create source from Stripe token
        var createSource = Meteor.wrapAsync(stripe.customers.createSource.bind(stripe.customers));
        var stripeUserID = Meteor.users.find({_id: Meteor.userId()}).fetch()[0].stripe_id;
        var card = createSource(stripeUserID, {
            source: {
                Stripetoken
            } 
        });
        return card;
    },
    'payment.getCredits'() {
        return Meteor.users.findOne({ _id: Meteor.userId() }).credits;
    },
    'payment.depositCredits'(creditPackage, buyer_id) {
        if (creditPackage == '') {
            throw new Meteor.Error('Missing', 'Must select credits package.');
        } else {
            var buyerStripeId = Meteor.users.findOne({ _id: buyer_id }).stripe_id;
            var buyerEmail = Meteor.users.findOne({ _id: buyer_id }).emails[0].address;
            var credits = 0;
            var ammount = 0;

            switch (creditPackage) {
                case 1:
                    credits = 260; // credit number will receive
                    ammount = 250; // money will be charged
                    break;
                case 2:
                    credits = 550;
                    ammount = 500;
                    break;
                case 3:
                    credits = 1100;
                    ammount = 1000;
                    break;
            }

            var buyerCredits = Meteor.users.findOne({ _id: buyer_id }).credits;
            Meteor.users.update({
                _id: buyer_id
            }, {
                $set: {
                    'credits': buyerCredits + credits
                }
            });

            //- run charge for default payment methods of buyerStripeId
            var charge = Meteor.wrapAsync(stripe.charges.create, stripe.charges);
            charge({
                amount: ammount * 100,
                currency: "hkd",
                description: 'Charge for deposit credits ' + credits,
                receipt_email: buyerEmail,
                customer: buyerStripeId
            }, function(err, charge) {
                //- deposit new credits of user
                if (!err) {
                    return charge;
                }
            });
        }
    }
});
