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
        }, function(err, result) {
            if (!err) {
                return result;
            }
        });
    },
    "claim.validProfit" () {
        return Kitchen_details.findOne({
            user_id: Meteor.userId()
        });
    }
});