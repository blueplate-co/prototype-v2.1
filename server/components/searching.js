import {
    Meteor
} from 'meteor/meteor';

import {
    Index,
    MinimongoEngine
} from 'meteor/easy:search';

const dishIndex = new Index({
    collection: Dishes,
    fields: ['dish_name'],
    name: 'dishIndex',
    engine: new MinimongoEngine({
        sort: () => {
            score: 1
        }, // sort by score
    }),
})


Meteor.methods({
    'searching'(keyword) {
        console.log(dishIndex.search(keyword).mongoCursor);
        return keyword;
    },
    'searchingKitchenByDistrict'(district, option) {
        if (option == 'all') {
            var pipeline = [
                {
                  $match: {
                    'profile.district': district
                  }
                },
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
                }
            ];
        } else {
            var pipeline = [{
                    $match: {
                        'profile.district': district
                    }
                },
                {
                    "$lookup": {
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
                    $match: {
                        'kitchen_details': {
                            $elemMatch: {
                                serving_option: option
                            }
                        }
                    }
                }
            ];
        }
        return Meteor.users.aggregate(pipeline);
    },
    'searchingDishAndMenuByDistrict'(district) {
        const pipeline = [{
                $match: {
                    'profile.district': district
                }
            },
            {
                $lookup: {
                    from: 'dishes',
                    localField: '_id',
                    foreignField: 'user_id',
                    as: 'dishes'
                }
            },
            {
                $lookup: {
                    from: 'menu',
                    localField: '_id',
                    foreignField: 'user_id',
                    as: 'menus'
                }
            },
            {
                $match: {
                    $or: [{
                        'dishes': {
                            $ne: []
                        }
                    }, {
                        'menus': {
                            $ne: []
                        }
                    }]
                }
            }
        ]
        return Meteor.users.aggregate(pipeline);
    },
    'searchAllDeliveryKitchen' (start, length) {
        const pipeline = [
            { $match: { serving_option: { "$in" : ["Delivery"]} } },
            { $skip: start },
            { $limit: length }
        ];
        return Kitchen_details.aggregate(pipeline);
    }
});