import {
    Meteor
} from 'meteor/meteor';

Meteor.methods({
    'dish.like' (dishId) {
        var buyer_name = Profile_details.findOne({
            user_id: Meteor.userId()
        }).foodie_name;

        var dishBuyed = Dishes.findOne({
            _id: dishId
        });

        var dishName = dishBuyed.dish_name;
        var seller_id = dishBuyed.user_id;

        var tittles = ['Bravo!! 👏 ', 'Congratulation! 🤝', 'Great! 🤩', 'Nice 🤩', 'Great work! 🏆', 'Hi! 👋']
        var title = tittles[Math.floor(Math.random()*tittles.length)];
        var messages = [buyer_name + ' like 👍 your dish ' + dishName, buyer_name + ' really like 👍 your dish ' + dishName + '. Go on!! 😘', dishName + ' has liked 👍 by ' + buyer_name];
        var message = messages[Math.floor(Math.random()*messages.length)];

        var notification = Notifications.find({
            item_id: { $exists: true, $eq: dishId }, // must check the document has item_id field
            receiver_id: seller_id,
            sender_id: Meteor.userId()
        }, { sort: { createdAt: -1 } }).fetch()[0];

        if (!notification) {
            //- no notification excute before that
            //- callback for make sure the notification will be displayed when like action run successful on database
            DishesLikes.insert({ user_id: Meteor.userId(), dish_id: dishId },function() {
                Notifications.insert({
                    item_id: dishId,
                    receiver_id: seller_id,
                    sender_id: Meteor.userId(),
                    title: title,
                    content: message,
                    read: false,
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
            })
        } else {
            //- existed notification before. Let check timeout
            var current = new Date();
            var lastExcute = new Date(notification.createdAt);
            if ((current - lastExcute) / 60e3 > 0.1) { // must timeout greater than 10 secs
                DishesLikes.insert({ user_id: Meteor.userId(), dish_id: dishId, createdAt: new Date() },function() {
                    Notifications.insert({
                        item_id: dishId,
                        receiver_id: seller_id,
                        sender_id: Meteor.userId(),
                        title: title,
                        content: message,
                        read: false,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    });
                })
            } else {
                console.log('Timeout must greater than 1 mins')
            }
        }
    },
    'dish.unlike' (dishId) {
        DishesLikes.remove({ user_id: Meteor.userId(), dish_id: dishId })
    },
    'menu.like' (menuId) {
        var buyer_name = Profile_details.findOne({
            user_id: Meteor.userId()
        }).foodie_name;

        var menuBuyed = Menu.findOne({
            _id: menuId
        });

        var menuName = menuBuyed.menu_name;
        var seller_id = menuBuyed.user_id;

        var tittles = ['Bravo!! 👏 ', 'Congratulation! 🤝', 'Great! 🤩', 'Nice 🤩', 'Great work! 🏆']
        var title = tittles[Math.floor(Math.random()*tittles.length)];
        var messages = [buyer_name + ' like 👍 your menu ' + menuName, buyer_name + ' really like 👍 your menu ' + menuName + '. Go on!! 😘', menuName + ' has liked 👍 by ' + buyer_name];
        var message = messages[Math.floor(Math.random()*messages.length)];

        var notification = Notifications.find({
            item_id: { $exists: true, $eq: menuId },
            receiver_id: seller_id,
            sender_id: Meteor.userId()
        }, { sort: { createdAt: -1 } }).fetch()[0];

        if (!notification) {
            //- no notification excute before that
            //- callback for make sure the notification will be displayed when like action run successful on database
            MenusLikes.insert({ user_id: Meteor.userId(), menu_id: menuId, createdAt: new Date() }, function() {
                Notifications.insert({
                    item_id: menuId, // must check the document has item_id field
                    receiver_id: seller_id,
                    sender_id: Meteor.userId(),
                    title: title,
                    content: message,
                    read: false,
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
            })
        } else {
            //- existed notification before. Let check timeout
            var current = new Date();
            var lastExcute = new Date(notification.createdAt);
            if ((current - lastExcute) / 60e3 > 0.1) { // must timeout greater than 10 secs
                //- callback for make sure the notification will be displayed when like action run successful on database
                MenusLikes.insert({ user_id: Meteor.userId(), menu_id: menuId }, function() {
                    Notifications.insert({
                        item_id: menuId,
                        receiver_id: seller_id,
                        sender_id: Meteor.userId(),
                        title: title,
                        content: message,
                        read: false,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    });
                })
            } else {
                console.log('Timeout must greater than 1 mins')
            }
        }
    },
    'menu.unlike' (menuId) {
        MenusLikes.remove({ user_id: Meteor.userId(), menu_id: menuId })
    },
    'dish.count_like'(date) {
        return DishesLikes.find({createdAt:{ $gt: date}}).fetch();
    },
    'menu.count_like'(date) {
        return MenusLikes.find({createdAt:{ $gt: date}}).fetch();
    }
});