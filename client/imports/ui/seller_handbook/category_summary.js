import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Mongo } from 'meteor/mongo';
import { Session } from 'meteor/session';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import CategoryInput from './add_category.js';
import CategoryList from './category_list.js';
import ArticleList from './article_list.js';
import SelectCategory from './select_category.js';

class CategorySummary extends Component {

  constructor (props) {
    super(props);
    this.add_cat = this.add_cat.bind(this);
    this.close_add_cat = this.close_add_cat.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this)
    this.state = {
      add_category: false,
      default_page: "categories",
      cat_display: '',
      cat_selected: ''
    }
  }

  componentDidMount() {
    window.scrollTo(0,0);
    $(document).ready(function(){
      $('ul.tabs').tabs();
    });
    Meteor.call('category.display', (error, result) => {
      if (result) {
        this.setState({
          cat_display: result,
        })
        $('#category_selection').material_select();
      }
    })
    if (Session.get('return_shb_tab') === 'articles' || Session.get('return_shb_tab') === 'categories')
    this.setState({
      default_page: Session.get('return_shb_tab')
    })
    $(document).ready(function(){
      $('ul.tabs').tabs();
    });
    Session.set('return_shb_tab','')
  }

  add_cat = () => {
    if (this.state.default_page === "categories") {
      this.setState({
        add_category: true
      });
    } else {
      FlowRouter.go('/seller-handbook/post/articles')
    }
  }

  goArticles = () => {
    this.setState({
      default_page: "articles",
      add_category: false
    })
  }

  goCat = () => {
    this.setState({
      default_page: "categories",
    })
  }

  close_add_cat = () => {
    this.setState({
      add_category: false
    })
  }

  cat_display = () => {
    return this.state.cat_display.map((item, index) => {
      return (
        <option key={index} value={item._id}>{item.cat_title}</option>
      )
    })
  }

  handleSelectChange(event) {
    this.setState({cat_selected: event.target.value});
  }

  render() {
    return (
      <div className = "container seller_handbook_category">
        <div className = "section">
          <h5>Manage seller handbook</h5>
          <div className = "row">
            <ul className="tabs">
              <li className="tab col xl3 l3 m3 s6"><a className={this.state.default_page==="categories"?"active":""} href="" onClick={this.goCat}>Categories</a></li>
              <li className="tab col xl3 l3 m3 s6"><a className={this.state.default_page==="articles"?"active":""} href="" onClick={this.goArticles}>Articles</a></li>
            </ul>
          </div>
          <div className = "row">
            <a className = "btn-flat waves-effect waves-red z-depth-0 left grey-text text-darken-1 cat_admin_btn" id = "add_cat" onClick={this.add_cat}>
              <i className="material-icons grey-text text-darken-1">add</i><span>Add</span>
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
        {
          (this.state.default_page === "categories")?
          <CategoryList cat_list = {this.props.cat_list} listLoading = {this.props.catListLoading}/>
          :
          <div>
            <SelectCategory
              handleSelectChange = {this.handleSelectChange}
              cat_display = {this.state.cat_display}
              cat_selected = {this.state.cat_selected}
            />
            <ArticleList cat_selected = {this.state.cat_selected} />
          </div>
        }
      </div>
    )
  }
}

export default withTracker ((props) => {
  const cat_handle = Meteor.subscribe('sellerhb_display_all');
  return {
    catListLoading: !cat_handle.ready(),
    cat_list: Seller_handbook_category.find({deleted: false}, {sort: {updatedAt: -1}}).fetch(),
  };
})(CategorySummary);
