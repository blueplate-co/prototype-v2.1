import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import PostEditor from './post_editor.js';
import ReactDOM from 'react-dom';

Seller_handbook_articles = new Mongo.Collection('seller_handbook_articles')

export default class ArticlePosting extends Component {
  constructor(props) {
    super(props)
    this.handleTextChange = this.handleTextChange.bind(this)
    this.handleSelectChange = this.handleSelectChange.bind(this)
    this.handlePublish = this.handlePublish.bind(this)
    this.state = {
      text: '',
      cat_selected: '',
      cat_display: '',
    } // You can also pass a Quill Delta here
  }

  componentDidMount() {
    var element = ReactDOM.findDOMNode(this.refs.dropdown)
    Meteor.call('category.display', (error, result) => {
      if (result) {
        this.setState({
          cat_display: result,
        })
        $(element).ready = () => {
          $('#category_selection').material_select();
        }
      }
    })
  }

  handleTextChange(value) {
    this.setState({ text: value })
  }

  handleSelectChange(event) {
    this.setState({cat_selected: '1'});
  }

  handlePublish() {
    Meteor.call('article.add', this.state.text)
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
          <input id="post_title" placeholder="Title" type="text"/>
          <select ref="dropdown" className="browser-default" id="category_selection" onChange={this.handleSelectChange} value={this.state.cat_selected}>
            <option value="" disabled>Choose the category</option>
            {(this.state.cat_display)? this.cat_list():""}
          </select>
        </div>
        <PostEditor handleChange = {this.handleTextChange} text = {this.state.text} />
        <div className = "editor_action">
          <div className = "btn post_publish right" onClick={this.handlePublish}>publish</div>
        </div>
      </form>
    )
  }
}
