import {
    Meteor
} from 'meteor/meteor';

Meteor.methods({
    'dish.like' (dishId) {
        DishesLikes.insert({ user_id: Meteor.userId(), dish_id: dishId })
    },
    'dish.unlike' (dishId) {
        DishesLikes.remove({ user_id: Meteor.userId(), dish_id: dishId })
    },
    'menu.like' (menuId) {
        MenusLikes.insert({ user_id: Meteor.userId(), menu_id: menuId })
    },
    'menu.unlike' (menuId) {
        MenusLikes.remove({ user_id: Meteor.userId(), menu_id: menuId })
    },
});