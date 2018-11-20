import { Meteor } from "meteor/meteor";

Meteor.methods({
    "district.count" () {
        const pipeline = [
            {
                "$lookup":
                {
                   from: "kitchen_details",
                   localField: "_id",
                   foreignField: "user_id",
                   as: "kitchen_details"
                }
            },
            {
                $match: {
                    'kitchen_details': {
                        $ne: []
                    }
                }
            },
            {
                "$group" : {_id:"$profile.district", count:{$sum:1}}
            }
        ]
        return Meteor.users.aggregate(pipeline);
    }
});