import { Meteor } from 'meteor/meteor';

Meteor.methods({
    'getMinPriceRange'(kitchenId) {
        let user_id = Kitchen_details.findOne({ _id: kitchenId }).user_id;
        let min_price = Dishes.find({ user_id: user_id },{ sort: { dish_selling_price: -1 }, limit: 1}).fetch();
        if (min_price[0]){
            return min_price[0].dish_selling_price;
        } else {
            return 0;
        }
    }
});

