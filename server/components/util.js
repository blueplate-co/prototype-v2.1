import { Meteor } from "meteor/meteor";

var stripe = require("stripe")("sk_live_kfIO2iUGk72NYkV1apRh70C7");

Meteor.publish("userData", function() {
  if (this.userId) {
    return Meteor.users.find(
      { _id: this.userId },
      {
        fields: { stripe_id: 1, credits: 1 },
      }
    );
  } else {
    this.ready();
  }
});

Meteor.publish("theBonusHistory", function() {
  return Bonus_history.find({});
});

Meteor.methods({
  "util.check_logged_user"() {
    return Meteor.user();
  },
  "util.get_list_no_payment"() {
    return Meteor.users
      .find({
        $or: [
          { stripe_id: { $exists: false } },
          { credits: { $exists: false } },
        ],
      })
      .fetch();
  },
  "util.generateUserPayment"(email, id) {
    if (!Meteor.users.find({ _id: id }).fetch()[0].stripe_id) {
      console.log(email);
      console.log(id);
      var createCustomer = Meteor.wrapAsync(
        stripe.customers.create.bind(stripe.customers)
      );
      var result = createCustomer({
        account_balance: 0,
        description: "Create customer for " + email,
        email: email,
      });
      if (result) {
        console.log(result);
        //- set customer stripe id for current user
        Meteor.users.update(
          {
            _id: id,
          },
          {
            $set: {
              stripe_id: result.id,
              credits: 0,
            },
          }
        );
        return result.id;
      } else {
        console.log(result);
      }
    }
  },
  "util.generateSellingPrice"(dish_id, selling_price) {
    var result = true;
    try {
      Dishes.update(
        {
          _id: dish_id,
        },
        {
          $set: {
            dish_selling_price: parseFloat(selling_price * 1.15).toFixed(2),
          },
        }
      );
    } catch (error) {
      var result = error;
    }

    return result;
  },
  "util.giveBonusForStaff"(email, amount) {
    try {
        var user = Meteor.users.findOne(
          { emails: { $elemMatch: { address: email } } }
        );
        var user_id = user._id;
        var buyerCredits = user.credits;
        Meteor.users.update(
            {
              _id: user_id,
            },
            {
              $set: {
                  credits: parseInt(buyerCredits + parseInt(amount)),
              },
            }
        ,() => {
          // add history only when tranfer done
          Bonus_history.insert({
            email: email,
            date: new Date(),
            amount: amount
          });
        });
    } catch (error) {
      throw new Error(error)
    }
  }
});
