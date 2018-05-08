import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Mongo } from 'meteor/mongo';
import { Session } from 'meteor/session';

import CategoryCard from './category_card.js';

Seller_handbook_category = new Mongo.Collection('seller_handbook_category')

class CategoryList extends Component {
  constructor(props) {
    super(props);
  }

  catList = () => {
    return this.props.cat_list.map((item, index) => {
      return (
        <div key = {index}>
          <CategoryCard
            id = {item._id}
            title ={item.cat_title}
            description = { item.cat_description }
            link = {item.icon_link.origin}
            article_count = {item.article_count}
            updatedAt = {item.updatedAt}
            icon_link = {item.icon_link.origin}
          />
        </div>
      )
    })
  }

  render() {
    return (
      <div>
      {
        (this.props.listLoading) ?
          <p>loading...</p>
          :
          this.catList()
      }
      </div>
    )
  }
}
  export default withTracker ((props) => {
    const cat_handle = Meteor.subscribe('sellerhb_display_all');
    return {
      listLoading: !cat_handle.ready(),
      cat_list: Seller_handbook_category.find({deleted: false}, {sort: {updatedAt: -1}}).fetch()
    };
  })(CategoryList);
