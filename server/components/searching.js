import {
    Meteor
} from 'meteor/meteor';


Meteor.methods({
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
                   "$lookup":
                   {
                      from: "dishes",
                      localField: "_id",
                      foreignField: "user_id",
                      as: "dishes"
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
                  	$addFields: {
                  	  	numberOfDishes: { $size: "$dishes" }
                  	}
                },
                {
                    $match: {
                        'numberOfDishes': {
                            $gte: 1
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
                    "$lookup":
                    {
                        from: "dishes",
                        localField: "_id",
                        foreignField: "user_id",
                        as: "dishes"
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
                    $addFields: {
                            numberOfDishes: { $size: "$dishes" }
                    }
                },
                {
                     $match: {
                         'numberOfDishes': {
                             $gte: 1
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