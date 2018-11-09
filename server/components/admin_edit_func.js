Meteor.methods({
    'admin.get_list_dish': function () {
        var email = Meteor.user().emails[0].address;
        if (email.indexOf('@blueplate.co') > 0) {
            return Dishes.find({deleted: false}).fetch();
        }
        return [];
    },
    'admin.get_list_ingredient'(dish_name, user_id) {
        // console.log(dish_name, user_id)
       return Ingredients.find({ dish_name: dish_name, user_id: user_id}).fetch();
    },
    'admin.update_dish': function(dish) {
        // console.log(dish);
        Dishes.update({
            _id: dish._id
          }, {
            $set: {
                dish_name: dish.dish_name,
                dish_description: dish.dish_description,
                serving_option: dish.serving_option,
                cooking_time: dish.cooking_time,
                days: dish.days,
                hours: dish.hours,
                mins: dish.mins,
                dish_cost: dish.dish_cost,
                dish_selling_price: dish.dish_selling_price,
                dish_profit: dish.dish_profit,
                allergy_tags: dish.allergy_tags,
                dietary_tags: dish.dietary_tags,
                dish_tags: dish.dish_tags,
                updatedAt: new Date(),
            }
          });
    }
});