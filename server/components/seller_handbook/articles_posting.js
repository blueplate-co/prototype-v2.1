import { Meteor } from 'meteor/meteor';

Seller_handbook_articles = new Mongo.Collection('seller_handbook_articles')

Meteor.methods({
  'article.add' (cat_id, text) {
    Seller_handbook_articles.insert({
      user_id: this.userId,
      cat_id: cat_id,
      text: text,
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
  }
})
