import { Meteor } from 'meteor/meteor';

Seller_handbook_articles = new Mongo.Collection('seller_handbook_articles')

Meteor.publish('shb_articles_display_all', function() {
  return Seller_handbook_articles.find({deleted: false}, {sort: {updatedAt: -1}})
})

Meteor.publish('shb_articles_display', function(cat_id) {
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
    var article_count = Seller_handbook_articles.find({cat_id: cat_id, deleted: false}).count();
    Seller_handbook_category.update({
      _id: cat_id
    },{
      $set: {
        article_count: article_count
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
    var article_count = Seller_handbook_articles.find({cat_id: cat_id, deleted: false}).count();
    Seller_handbook_category.update({
      _id: cat_id
    },{
      $set: {
        article_count: article_count
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
    var article_count = Seller_handbook_articles.find({cat_id: cat_id, deleted: false}).count();
    Seller_handbook_category.update({
      _id: cat_id
    },{
      $set: {
        article_count: article_count
      }
    })
  },
  'article.find' (_id) {
    return Seller_handbook_articles.findOne({_id: _id})
  },
  'article.display' (cat_id) {
    return Seller_handbook_articles.find({cat_id: cat_id, deleted: false}).fetch()
  }
})
