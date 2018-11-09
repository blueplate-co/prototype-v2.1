Comment = new Mongo.Collection('comment');

Meteor.methods({
    'comment.count'(article_type, article_id) {
        try {
            return Comment.find({ article_type: article_type, article_id: article_id }).count();
        } catch (error) {
            return error;
        }
    },
    'comment.getComment'(article_type, article_id, skip) {
        try {
            const pipeline = [
                {
                    $match: {
                        $and: [ 
                            { article_type: article_type }, 
                            { article_id: article_id },
                        ]
                        
                    }
                },
                {
                    $lookup: {
                        from: 'profile_details',
                        localField: 'user_id',
                        foreignField: 'user_id',
                        as: 'profile'
                    }
                },
                {
                    $lookup: {
                      from: 'kitchen_details',
                      localField: 'user_id',
                      foreignField: 'user_id',
                      as: 'kitchen'
                    }
                },
                { $sort : { create_at : -1 } },
                { $skip : skip },
                { $limit: 5 }
            ];
            return Comment.aggregate(pipeline);
        } catch (error) {
            return error;
        }
    },
    'comment.insert'(article_type, article_id, content) {
        if (Meteor.userId()) {
            try {
                Comment.insert({
                    user_id: Meteor.userId(),
                    article_type: article_type,
                    article_id: article_id,
                    content: content,
                    create_at: new Date()
                },() => {
                    return "Success";
                });
            } catch (error) {
                return "Error";
            }
        } else {
            return new Meteor.error('error', 'Must login to comment');
        }
    },
    'comment.notification'(article_type, article_id, content) {
        var ownerId = '';
        var product_name = '';
        if (article_type == 'dish') {
            let product = Dishes.findOne({ _id: article_id });
            ownerId = product.user_id;
            product_name = product.dish_name;
        } else {
            let product = Menu.findOne({ _id: article_id });
            ownerId = product.user_id;
            product_name = product.menu_name;
        }
        //- when ownerId == userid ==> send notification to all participant join this chat expect owner
        if (Meteor.userId() == ownerId) {
            var ownerName = Kitchen_details.findOne({user_id: Meteor.userId()}).chef_name;
            var all_comments = Comment.find({ article_id: article_id }).fetch();
            var participants = [];
            for (var i = 0; i < all_comments.length; i++) {
                if (all_comments[i].user_id !== Meteor.userId()) {
                    participants.push(all_comments[i].user_id);
                }
            }
            var title = ownerName + 'has comment on ' + product_name;
            uniqueParticipants = participants.filter(function(item, pos) {
                return participants.indexOf(item) == pos;
            });
            for (var i = 0; i < uniqueParticipants.length; i++) {
                Notifications.insert({
                    item_id: article_id,
                    receiver_id: participants[i],
                    sender_id: Meteor.userId(),
                    title: title,
                    content: content,
                    read: false,
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
            }
        } else {
            var participants = [];
            var all_comments = Comment.find({ article_id: article_id }).fetch();
            for (var i = 0; i < all_comments.length; i++) {
                if (all_comments[i].user_id !== Meteor.userId()) {
                    participants.push(all_comments[i].user_id);
                }
            }
            var title = 'New comment on ' + product_name;
            uniqueParticipants = participants.filter(function(item, pos) {
                return participants.indexOf(item) == pos;
            });
            for (var i = 0; i < uniqueParticipants.length; i++) {
                Notifications.insert({
                    item_id: article_id,
                    receiver_id: participants[i],
                    sender_id: Meteor.userId(),
                    title: title,
                    content: content,
                    read: false,
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
            }
        }
    }
})