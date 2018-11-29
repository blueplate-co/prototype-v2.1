import { CronJob } from 'cron';

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

var sendTotalEmail = function(oWeeklySummary) {
    for (var seller_id in oWeeklySummary) {

        var total_infor = oWeeklySummary[seller_id];
        var seller_detail = Meteor.users.findOne({_id: seller_id});
        var seller_email = seller_detail.emails[0].address;
        var kitchen_detail = Kitchen_details.findOne({ user_id: seller_id});
        var chef_name = (kitchen_detail.chef_name).trim();
        // console.log(seller_email);
        // console.log('kitchen_detail', kitchen_detail);

        var content = 'Hi ' + chef_name +
        ',\nThanks for being with us so far. Let’s see how you are doing on the platform this week.\n\n';

        var total_infor = oWeeklySummary[seller_id];
        if (total_infor.dish_view) {
            content += 'Total dishes view: ' + total_infor.dish_view
        }

        if (total_infor.dish_like) {
            content += '\nTotal dishes like: ' + total_infor.dish_like;
        }

        if (total_infor.menu_view) {
            content += '\nTotal menu view: ' + total_infor.menu_view;
        }

        if (total_infor.menu_like) {
            content += '\nTotal menu like: ' + total_infor.menu_like;
        }

        content += '\n\nShould you wonder how to improve your traffic and got more orders,' + 
        ' please do not hesitate to reach out our CS on Blueplate platform. We are always ' + 
        'there to support. Check out here:\n' + 'https://www.blueplate.co' + '\n\nNice weekend to you,\nBest regards,\nBlueplate team'

        Meteor.call('requestdish.sendEmail', 
          seller_email,
          '',
          'Total view for a week',
          content
        )
    }
};

/**
 * reference link: https://github.com/kelektiv/node-cron
 * Auto send email every Friday at 10:00:00 AM, follow Hong_Kong timezone
 */
const job = new CronJob({
    cronTime: '00 00 10 * * 5', // seconds menutes hours * * day of week (0-6: Sun-Sat)
    // use this wrapper if you want to work with mongo:
    onTick: Meteor.bindEnvironment(() => {
        var curr_date = new Date();
        var day_before = curr_date.getDate() - 7;
        curr_date.setDate(day_before);
        var oWeeklySummary = {};

        console.log('oWeeklySummary 46');
        // Get dish_view
        Meteor.call('dish.total_view', curr_date, (err, res) => {
            if (!err) {
                res.map((item, index) => {
                    var seller_id = item.seller_id;
            
                    if (oWeeklySummary[seller_id]) {
                        oWeeklySummary[seller_id].dish_view = oWeeklySummary[seller_id].dish_view + 1
                    } else {
                        oWeeklySummary[seller_id] = {};
                        oWeeklySummary[seller_id].dish_view = 1;
                    }
                });

                // Get dish_like
                Meteor.call('dish.count_like', curr_date, (err, res) => {
                    if (!err) {
                        res.map((item, index) => {
                            Meteor.call('dish.get_detail', item.dish_id, (err, res) => {
                            if (!err) {
                                var seller_id = res.user_id;
                                if (oWeeklySummary[seller_id]) {
                                    if (oWeeklySummary[seller_id].dish_like) {
                                        oWeeklySummary[seller_id].dish_like = oWeeklySummary[seller_id].dish_like + 1;
                                    } else {
                                        oWeeklySummary[seller_id].dish_like = {};
                                        oWeeklySummary[seller_id].dish_like = 1;
                                    }
                                } else {
                                    oWeeklySummary[seller_id] = {};
                                    oWeeklySummary[seller_id].dish_like = 1;
                                }
                            }
                            });
                        });

                        // Get menu_view
                        Meteor.call('menu.total_view', curr_date, (err, res) => {
                            if (!err) {
                                res.map((item, index) => {
                                    var seller_id = item.seller_id;
                                    if (oWeeklySummary[seller_id]) {
                                        if (oWeeklySummary[seller_id].menu_view) {
                                            oWeeklySummary[seller_id].menu_view = oWeeklySummary[seller_id].menu_view + 1;
                                        } else {
                                            oWeeklySummary[seller_id].menu_view = {};
                                            oWeeklySummary[seller_id].menu_view = 1;
                                        }
                                    } else {
                                        oWeeklySummary[seller_id] = {};
                                        oWeeklySummary[seller_id].menu_view = 1;
                                    }
                                });

                                // Ge menu_like
                                Meteor.call('menu.count_like', curr_date, (err, res) => {
                                    if (!err) {
                                        res.map((item, index) => {
                                            Meteor.call('menu.get_menu_detail', item.menu_id, (err, res) => {
                                                if (!err) {
                                                    var seller_id = res.user_id;
                                                    if (oWeeklySummary[seller_id]) {
                                                        if (oWeeklySummary[seller_id].menu_like) {
                                                            oWeeklySummary[seller_id].menu_like = oWeeklySummary[seller_id].menu_like + 1;
                                                        } else {
                                                            oWeeklySummary[seller_id].menu_like = {};
                                                            oWeeklySummary[seller_id].menu_like = 1;
                                                        }
                                                    } else {
                                                        oWeeklySummary[seller_id] = {};
                                                        oWeeklySummary[seller_id].menu_like = 1;
                                                    }
                                                }
                                            });
                                        });
                                        sendTotalEmail(oWeeklySummary);
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    }),
    start: true,
    timeZone: 'Asia/Hong_Kong',
});

job.start();