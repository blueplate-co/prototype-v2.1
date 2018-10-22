Template.reminder_promotion_modal.helpers({
    'promotion_amount': function () {
        return Template.instance().amount.get();
    }
});

Template.reminder_promotion_modal.created = function (){
    var self = this;
    self.amount = new ReactiveVar(0);
    Meteor.call('promotion.check_history', (err, res) => {
        if (Object.keys(res).length > 0) { // this user already have promotion before
            self.amount.set(res.balance);
        }
    });
}