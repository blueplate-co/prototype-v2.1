import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import PostEditor from './post_editor.js';

Seller_handbook_articles = new Mongo.Collection('seller_handbook_articles')

export default class ArticlePosting extends Component {
  constructor(props) {
    super(props)
    this.handleTitleChange = this.handleTitleChange.bind(this)
    this.handleTextChange = this.handleTextChange.bind(this)
    this.handleSelectChange = this.handleSelectChange.bind(this)
    this.handlePublish = this.handlePublish.bind(this)
    this.state = {
      post_title: '',
      post_text: '',
      cat_selected: '',
      cat_display: '',
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
  }

  handleTitleChange(event) {
    this.setState({post_title: event.target.value});
  }

  handleTextChange(value) {
    this.setState({ post_text: value })
  }

  handleSelectChange(event) {
    this.setState({cat_selected: event.target.value});
  }

  handlePublish() {
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
      }
    })
  }

  cat_list = () => {
    return this.state.cat_display.map((item, index) => {
      return (
        <option key={index} value={item._id}>{item.cat_title}</option>
      )
    })
  }

  render() {
    return (
      <form className = "container">
        <div className  = "post_title_wrapper">
          <input id="post_title" placeholder="Title" type="text" onChange={this.handleTitleChange} value={this.state.post_title}/>
          <select ref="dropdown" className="browser-default" id="category_selection" onChange={this.handleSelectChange} value={this.state.cat_selected}>
            <option value="" disabled>Choose the category</option>
            {(this.state.cat_display)? this.cat_list():""}
          </select>
        </div>
        <PostEditor handleChange = {this.handleTextChange} text = {this.state.post_text} />
        <div className = "editor_action">
          <div className = "btn-floating btn post_publish right" onClick={this.handlePublish}>publish</div>
        </div>
      </form>
    )
  }
}
