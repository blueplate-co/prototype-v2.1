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
                dish_selling_price: dish.dish_selling_price * 1.15,
                dish_profit: dish.dish_profit,
                allergy_tags: dish.allergy_tags,
                dietary_tags: dish.dietary_tags,
                dish_tags: dish.dish_tags,
                updatedAt: new Date(),
                meta: dish.meta,
                user_edit: Meteor.userId()
            }
          });
    },
    'admin.insert_new_ingredient'(ingredient) {
        Ingredients.insert({
            dish_name: ingredient.dish_name,
            user_id: ingredient.user_id,
            ingredient_name: ingredient.ingredient_name,
            ingredient_quantity: ingredient.ingredient_quantity,
            ingredient_unit: ingredient.ingredient_unit,
        });
    },
    'admin.update_exist_ingredient'(ingredient) {
        Ingredients.update({
            _id: ingredient._id
        }, {
            $set: {
                ingredient_name: ingredient.ingredient_name,
                ingredient_quantity: ingredient.ingredient_quantity,
                ingredient_unit: ingredient.ingredient_unit
            }
        })
    },
    'admin.remove_image'(img_id) {
        Images.remove({ _id: img_id});
    },
    'admin.update_kitchen'(kitchenObj) {
        Kitchen_details.update({
            _id: kitchenObj._id
        }, {
            $set: {
                kitchen_name: kitchenObj.kitchen_name,
                chef_name: kitchenObj.chef_name,
                kitchen_address_country: kitchenObj.kitchen_address_country,
                kitchen_address: kitchenObj.kitchen_address,
                kitchen_address_conversion: kitchenObj.kitchen_address_conversion,
                kitchen_contact: kitchenObj.kitchen_contact,
                serving_option: kitchenObj.serving_option,
                cooking_exp: kitchenObj.cooking_exp,
                cooking_story: kitchenObj.cooking_story,
                kitchen_speciality: kitchenObj.kitchen_speciality,
                kitchen_tags: kitchenObj.kitchen_tags,
                house_rule: kitchenObj.house_rule,
                profileImg: kitchenObj.profileImg,
                bannerProfileImg: kitchenObj.bannerProfileImg,
                admin_update_id: Meteor.userId(),
                updatedAt: new Date()
            }
        });
    }
});