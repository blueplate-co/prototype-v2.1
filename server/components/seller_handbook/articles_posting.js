import { Meteor } from 'meteor/meteor';

Seller_handbook_articles = new Mongo.Collection('seller_handbook_articles')

Meteor.methods({
  'article.add' (cat_title, text) {
    Seller_handbook_articles.insert({
      user_id: this.userId,
      cat_title: cat_title,
      text: text,
      likes: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      deleted: false
    })
    Seller_handbook_category.update({
      cat_title:cat_title
    },{
      $inc:{
        article_count: 1
      }
    })
  }
})
