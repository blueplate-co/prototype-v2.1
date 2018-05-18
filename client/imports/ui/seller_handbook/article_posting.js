import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import PostEditor from './post_editor.js';
import SelectCategory from './select_category.js';

Seller_handbook_articles = new Mongo.Collection('seller_handbook_articles')

export default class ArticlePosting extends Component {
  constructor(props) {
    super(props)
    this.handleTitleChange = this.handleTitleChange.bind(this)
    this.handleTextChange = this.handleTextChange.bind(this)
    this.handlePublish = this.handlePublish.bind(this)
    this.handleSelectChange = this.handleSelectChange.bind(this)
    this.state = {
      post_title: '',
      post_text: '',
      cat_selected: '',
      cat_display: '',
      edit_post_id: '',
    } // You can also pass a Quill Delta here
  }

  componentDidMount() {
    Meteor.call('category.display', (error, result) => {
      if (result) {
        this.setState({
          cat_display: result,
        })
        $('#category_selection').material_select();
      }
    })
    if (FlowRouter.getParam('article_id')) {
      Meteor.call('article.find', FlowRouter.getParam('article_id'), (error, result) => {
        if (result) {
          this.setState({
            cat_selected: result.cat_id,
            post_title: result.post_title,
            post_text: result.post_text,
          })
        }
      })
    }
  }

  handleSelectChange(event) {
    this.setState({cat_selected: event.target.value});
  }

  handleTitleChange(event) {
    this.setState({post_title: event.target.value});
  }

  handleTextChange(value) {
    this.setState({ post_text: value })
  }

  close_editor() {
    Session.set('return_shb_tab', "articles")
    FlowRouter.go('/seller_handbook/admin');
  }

  handlePublish() {
    if (FlowRouter.getParam('article_id')) {
      Meteor.call('article.update', FlowRouter.getParam('article_id'), this.state.cat_selected, this.state.post_title, this.state.post_text, (error, result) => {
        if (error) {
          Materialize.toast(error + ' Please try again later.', 3000)
        } else {
          Materialize.toast('Article updated.', 3000)
          this.setState({
            post_title: '',
            post_text: '',
            cat_selected: '',
          })
          Session.set('return_shb_tab', "articles")
          FlowRouter.go('/seller_handbook/admin');
        }
      })
    } else {
      Meteor.call('article.add', this.state.cat_selected, this.state.post_title, this.state.post_text, (error, result) => {
        if (error) {
          Materialize.toast(error + ' Please try again later.', 3000)
        } else {
          Materialize.toast('Article published.', 3000)
          this.setState({
            post_title: '',
            post_text: '',
            cat_selected: '',
          })
          Session.set('return_shb_tab', "articles")
          FlowRouter.go('/seller_handbook/admin');
        }
      })
    }

  }

  render() {
    return (
      <form className = "container">
        <a className = "btn-floating waves-effect waves-red z-depth-0 transparent grey-text text-darken-1" id = "close_input" onClick={this.close_editor}>
          <i className="material-icons grey-text text-darken-1">close</i>
        </a>
        <div className  = "post_title_wrapper">
          <input id="post_title" placeholder="Title" type="text" onChange={this.handleTitleChange} value={this.state.post_title}/>
          <SelectCategory
            handleSelectChange = {this.handleSelectChange}
            cat_display = {this.state.cat_display}
            cat_selected = {this.state.cat_selected}
          />
        </div>
        <PostEditor handleChange = {this.handleTextChange} text = {this.state.post_text} />
        <div className = "editor_action">
          <div className = "btn-floating btn post_publish right" onClick={this.handlePublish}>{FlowRouter.getParam('article_id')?"update":"publish"}</div>
        </div>
      </form>
    )
  }
}
