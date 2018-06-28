import {
    Meteor
} from "meteor/meteor";

Meteor.methods({
    "claim.request" (chef_id, placeholder_name, bank_info, bank_account_number, amount) {
        console.log('ID: ' + chef_id);
        console.log('Placeholder name: ' + placeholder_name);
        console.log('Bank info: ' + bank_info);
        console.log('Bank account number: ' + bank_account_number);
        console.log('Amount: ' + amount);
        Claim_Request.insert({
            user_id: chef_id,
            placeholder_name: placeholder_name,
            bank_info: bank_info,
            bank_account_number: bank_account_number,
            amount: amount,
            status: 'pending',
            createdAt: new Date()
        }, function (err, result) {
            if (!err) {
                return result;
            }
        });
    },
    "claim.validProfit" () {
        return Kitchen_details.findOne({
            user_id: Meteor.userId()
        });
    },
    "claim.updateprofit" (seller_id, profit) {
        Kitchen_details.update({
            user_id: seller_id
        }, {
            $set: {
                current_profit: profit
            }
        }, function (err) {
            if (err) {
                throw new Meteor.Error(500, error.message);
            } else {
                return 'Update profit success';
            }
        });
    },
    'claim.getListRequest' () {
        return Claim_Request.find({
            user_id: Meteor.userId()
        }).fetch();
    },
    "claim.summaryProfit" () {
        var all_request = Profile_details.find({}).fetch();
        for (var i = 0; i < all_request.length; i++) {
            var current_profit = all_request[i].current_profit;
            var available_profit = all_request[i].available_profit;
            Profile_details.update({}, {
                $set: {
                    available_profit: (parseFloat(available_profit) + parseFloat(current_profit)).toFixed(2)
                }
            }, {
                multi: true
            });
        }
    }
});