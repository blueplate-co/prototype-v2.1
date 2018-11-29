Meteor.methods({
    'chef_categories.create'(categories_name) {
        let existed_data = Chef_Categories.findOne({categories_name: categories_name});
        if (existed_data) {
            return false;
        } else {
            Chef_Categories.insert({
                categories_name: categories_name,
                banner: '',
                description: '',
                items: [],
                created_at: new Date()
            })
        }
    },
    'chef_categories.get'(categories_name) {
        let categories = Chef_Categories.findOne({ categories_name: categories_name });
        if (categories) {
            var results = [];
            for (var i = 0; i < categories.items.length; i++) {
                let kitchen = Kitchen_details.findOne({
                    '_id': categories.items[i]
                });
                results.push(kitchen);
            }
            return results;
        } else {
            return [];
        }
    },
    'chef_categories.getTag'(tag) {
        let result = Kitchen_details.find({ "kitchen_tags.tag": {'$regex': tag, '$options': 'i'} }).fetch();
        return result;
    },
    'chef_categories.getInfo'(categories_name) {
        let categories = Chef_Categories.findOne({ categories_name: categories_name });
        if (categories) {
            return categories;
        } else {
            return [];
        }
    },
    'chef_categories.getInfoById'(id) {
        let categories = Chef_Categories.findOne({ _id: id });
        if (categories) {
            return categories;
        } else {
            return [];
        }
    },
    'chef_categories.bestSelling'() {
        var pipeline = [
            {
              $group : {
                _id : "$seller_id",
                count: { $sum: 1 }
              }
            },
            {
              $sort : {
                count: -1
              }
            },
            {
              $limit : 4
            },
            {
              $lookup: {
                 from: "kitchen_details",
                 localField: "_id",
                 foreignField: "user_id",
                 as: "kitchen_details"
              }
            }
        ];
        var queryResult = Order_record.aggregate(pipeline);
        console.log(queryResult);
        var result = [];
        queryResult.map((item, index) => {
            result.push(item.kitchen_details[0]);
        });
        return result;
    }
})