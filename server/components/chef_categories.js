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
    }
})