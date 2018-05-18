import { Meteor } from 'meteor/meteor';

Seller_handbook_articles = new Mongo.Collection('seller_handbook_articles')

Meteor.publish('shb_articles_display_all', function(cat_id) {
  return Seller_handbook_articles.find({cat_id: cat_id, deleted: false}, {sort: {updatedAt: -1}})
})


Meteor.methods({
  'article.add' (cat_id, post_title, post_text) {
    Seller_handbook_articles.insert({
      user_id: this.userId,
      cat_id: cat_id,
      post_title: post_title,
      post_text: post_text,
      likes: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      deleted: false
    })
    Seller_handbook_category.update({
      _id: cat_id
    },{
      $inc:{
        article_count: 1
      }
    })
  },
  'article.update' (_id, cat_id, post_title, post_text) {
    Seller_handbook_articles.update({
      _id: _id
    } , {
      $set: {
        cat_id: cat_id,
        post_title: post_title,
        post_text: post_text,
        updatedAt: new Date()
      }
    })
  },
  'article.remove' (cat_id, _id) {
    Seller_handbook_articles.update({
        _id: _id
      }, {
        $set: {
        updatedAt: new Date(),
        deleted: true
      }
    })
    Seller_handbook_category.update({
      _id: cat_id
    },{
      $inc: {
        artcile_count: -1
      }
    })
  },
  'article.find' (_id) {
    return Seller_handbook_articles.findOne({_id: _id})
  }
})
