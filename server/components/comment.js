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
    }
})