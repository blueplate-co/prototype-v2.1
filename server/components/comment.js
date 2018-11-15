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
        //- prepare all information of comment
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
        if (Meteor.userId() == ownerId) {
            var ownerName = Kitchen_details.findOne({user_id: Meteor.userId()}).chef_name;
        }


        //- GET ALL USERS HAS COMMENTED ON THIS POST
        var all_comments = Comment.find({ article_id: article_id }).fetch();
        var participants = [];
        //- push userid not owner and not already in participants list
        for (var i = 0; i < all_comments.length; i++) {
            if (all_comments[i].user_id !== Meteor.userId() && participants.indexOf(all_comments[i].user_id) == -1) {
                participants.push(all_comments[i].user_id);
            }
        }

        //- GET ALL USERS HAS LIKE THIS POST
        if (article_type == 'dish') {
            let all_likes = DishesLikes.find({ dish_id: article_id }).fetch();
            //- push userid not owner and not already in participants list
            for (var i = 0; i < all_likes.length; i++) {
                if (all_likes[i].user_id !== Meteor.userId() && participants.indexOf(all_likes[i].user_id) == -1) {
                    participants.push(all_likes[i].user_id);
                }
            }
        } else {
            let all_likes = MenusLikes.find({ menu_id: article_id }).fetch();
            //- push userid not owner and not already in participants list
            for (var i = 0; i < all_likes.length; i++) {
                if (all_likes[i].user_id !== Meteor.userId() && participants.indexOf(all_likes[i].user_id) == -1) {
                    participants.push(all_likes[i].user_id);
                }
            }
        }

        //- GET ALL USER HAS VIEWS THIS POST
        if (article_type == 'dish') {
            let all_views = DishesViews.find({ dish_id: article_id }).fetch();
            //- push userid not owner and not already in participants list
            for (var i = 0; i < all_views.length; i++) {
                if (all_views[i].user_id !== Meteor.userId() && participants.indexOf(all_views[i].user_id) == -1) {
                    participants.push(all_views[i].user_id);
                }
            }
        } else {
            let all_views = MenusViews.find({ menu_id: article_id }).fetch();
            //- push userid not owner and not already in participants list
            for (var i = 0; i < all_views.length; i++) {
                if (all_views[i].user_id !== Meteor.userId() && participants.indexOf(all_views[i].user_id) == -1) {
                    participants.push(all_views[i].user_id);
                }
            }
        }
        //- remove all null item in array
        var participants = participants.filter(function (element) {
            return element != null;
        });
        console.log(participants);
        var reply_comment_url = `${Meteor.absoluteUrl()}/${article_type}/${article_id}`;
        for (var i = 0; i < participants.length; i++) {
            let ownerEmail = Meteor.users.findOne({ _id: ownerId }).emails[0].address;
            // console.log('User id: ' + participants[i]);
            // console.log('User of id: ' + Meteor.users.findOne({ _id: participants[i] }));
            let emails = Meteor.users.findOne({ _id: participants[i] }).emails[0].address;
            if (ownerId == Meteor.userId()) {
                //- commenter is owner
                Meteor.call(
                    'requestdish.sendEmail',
                    ownerName + " <" + emails + ">",
                    '',
                    ownerName + ' has commented on ' + product_name,
                    `${ownerName} has commented on ${product_name}. " ${content} "To reply this comment, just visit the following link:\n\n${reply_comment_url}`
                );    
            } else {
                //- commeter is not owner
                if (emails !== ownerEmail) {
                    Meteor.call(
                        'requestdish.sendEmail',
                        ownerName + " <" + emails + ">",
                        '',
                        ownerName + ' has commented on ' + product_name,
                        `${ownerName} has commented on ${product_name}. " ${content} "To reply this comment, just visit the following link:\n\n${reply_comment_url}`
                    ); 
                } else {
                    Meteor.call(
                        'requestdish.sendEmail',
                        ownerName + " <" + emails + ">",
                        '',
                        ownerName + ' has commented on your ' + product_name,
                        `${ownerName} has commented on your ${product_name}. " ${content} "To reply this comment, just visit the following link:\n\n${reply_comment_url}`
                    ); 
                }
            }
        }
        
    }
})