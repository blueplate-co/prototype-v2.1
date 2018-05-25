import { Meteor } from 'meteor/meteor';

Seller_handbook_category = new Mongo.Collection('seller_handbook_category')

Meteor.publish('sellerhb_display_all', function() {
  return Seller_handbook_category.find({deleted: false}, {sort: {updatedAt: -1}})
})

Meteor.methods({
  'category.add' (cat_title, cat_description, icon_link, createdBy) {
    Seller_handbook_category.insert({
      cat_title: cat_title,
      cat_description: cat_description,
      icon_link: icon_link,
      createdBy: createdBy,
      createdAt: new Date(),
      updatedAt: new Date(),
      article_count: 0,
      deleted: false
    })
  },
  'category.update' (_id, cat_title, cat_description, icon_link) {
    Seller_handbook_category.update({
      _id: _id
    }, {
      $set: {
        cat_title: cat_title,
        cat_description: cat_description,
        icon_link: icon_link,
        updatedAt: new Date()
      }
    })
  },
  'category.remove' (_id) {
    Seller_handbook_category.update({
      _id: _id
    }, {
      $set: {
      updatedAt: new Date(),
      deleted: true
      }
    })
  },
  'category.display' () {
    return Seller_handbook_category.find({deleted: false}, {sort:{cat_title: 1}}).fetch();
  },
  'category.find' (cat_title) {
    return Seller_handbook_category.findOne({deleted: false, cat_title: cat_title});
  },
  'category.findById' (cat_id) {
    return Seller_handbook_category.findOne({_id: cat_id});
  }
})
