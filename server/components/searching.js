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
        sort: () => { score: 1 }, // sort by score
    }),
})


Meteor.methods({
    'searching' (keyword) {
        console.log(dishIndex.search(keyword).mongoCursor);
        return keyword;
    }
});