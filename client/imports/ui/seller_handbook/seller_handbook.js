import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Mongo } from 'meteor/mongo';
import { Session } from 'meteor/session';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import CategoryInput from './add_category.js';
import CategoryList from './category_list.js';

class CategorySummary extends Component {

  constructor (props) {
    super(props);
    this.add_cat = this.add_cat.bind(this);
    this.close_add_cat = this.close_add_cat.bind(this);
    this.state = {
      add_category: false
    }
  }

  add_cat = () => {
    this.setState({
      add_category: true
    });
  }

  close_add_cat = () => {
    this.setState({
      add_category: false
    })
  }

  render() {
    return (
      <div className = "container seller_handbook_category">
        <div className = "section">
          <h5>Seller handbook category list</h5>
          <div className = "row">
            <a className = "btn-flat waves-effect waves-red z-depth-0 left grey-text text-darken-1 cat_admin_btn" id = "add_cat" onClick={ () => this.add_cat() }>
              <i className="material-icons grey-text text-darken-1">add</i><span>Add</span>
            </a>
            <a className = "btn-flat waves-effect waves-red z-depth-0 left grey-text text-darken-1 cat_admin_btn" id = "edit_cat">
              <i className="material-icons grey-text text-darken-1" id= "edit_cat">edit</i><span>Edit</span>
            </a>
            <a className = "btn-flat waves-effect waves-red z-depth-0 left grey-text text-darken-1 cat_admin_btn" id = "remove_cat">
              <i className="material-icons grey-text text-darken-1" id = "remove_cat">close</i><span>Remove</span>
            </a>
          </div>
        </div>
        <div className = "divider"></div>
        <div className = "section">
          {
            (this.state.add_category) ?
            <CategoryInput close_add_cat={this.close_add_cat} />
            : ""
          }
        </div>
        <CategoryList />
      </div>
    )
  }
}

export default CategorySummary;
