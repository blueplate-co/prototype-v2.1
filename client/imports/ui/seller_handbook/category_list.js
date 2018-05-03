import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Mongo } from 'meteor/mongo';
import { Session } from 'meteor/session';

Seller_handbook_category = new Mongo.Collection('seller_handbook_category')

class CategoryList extends Component {
  constructor(props) {
    super(props);
  }

  catList = () => {
    return this.props.cat_list.map((item, index) => {
      return (
        <div key = {index}>
          <p>{item.cat_title}</p>
        </div>
      )
    })
  }

  render() {
    return (
      <div>
      {
      (this.props.listLoading) ?
        <p>loading..</p>
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
      cat_list: Seller_handbook_category.find({deleted: false}).fetch()
    };
  })(CategoryList);
