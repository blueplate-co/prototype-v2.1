import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Mongo } from 'meteor/mongo';
import { Session } from 'meteor/session';

import ArticleCard from './article_card.js';

class ArticleList extends Component {
  constructor(props) {
    super(props);
  }

  display_article_list = () => {
    return this.props.article_list.map((item,index) => {
      const post = document.createElement('post')
      post.innerHTML = item.post_text
      if (post.getElementsByTagName("img")[0]) {
        var img_link = post.getElementsByTagName("img")[0].src
      } else {
        var img_link = ""
      }
      const p = post.textContent
      return (
        <div key = {index}>
          <ArticleCard
            cat_id = {item.cat_id}
            user_id = {item.user_id}
            _id = {item._id}
            img = {img_link}
            title ={item.post_title}
            description = {p}
            updatedAt = {item.updatedAt}
          />
        </div>
      )
    })
  }

  render() {
    return (
      <div className = "section">
      {
        this.props.artListLoading?
        <p>loading...</p>
        :
        this.display_article_list().length > 0 ?
        this.display_article_list()
        :
        <p>No articles in this category yet</p>
      }
      </div>
    )
  }
}

export default withTracker (({cat_selected} , props) => {
  console.log(cat_selected);
  if (cat_selected === '' || !cat_selected) {
    console.log('yes')
    const art_handle = Meteor.subscribe('shb_articles_display_all', cat_selected);
    return {
      artListLoading: !art_handle.ready(),
      article_list: Seller_handbook_articles.find({deleted: false}, {sort: {updatedAt: -1}}).fetch()
    }
  } else {
    console.log('no')
    const art_handle = Meteor.subscribe('shb_articles_display', cat_selected);
    return {
      artListLoading: !art_handle.ready(),
      article_list: Seller_handbook_articles.find({cat_id: cat_selected, deleted: false}, {sort: {updatedAt: -1}}).fetch()
    }
  }
})(ArticleList);
