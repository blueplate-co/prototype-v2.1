import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.bubble.css';

import Shb_breadcrumb from './shb_breadcrumb.js';
import FoodieAvatar from '../foodie_avatar.js';

export default class ArticleDisplay extends Component {
  constructor(props) {
    super(props)
    this.state = {
      article_display: '',
      cat_title: '',
      data_loading: true,
      author: '',
      authorIntro:'',
    }
  }

  componentDidMount() {
    window.scrollTo(0,0);
    Meteor.call('article.find', FlowRouter.getParam('article_id'), (error, result) => {
      if (result) {
        const author = Profile_details.findOne({user_id: result.user_id});
        this.setState({
          article_display: result,
          author: author.foodie_name,
          authorIntro: author.about_myself
        })
        Meteor.call('category.findById', result.cat_id, (error, result) => {
          if (result) {
            this.setState({
              cat_title: result.cat_title,
              data_loading: false,
            })
          }
        })
      }
    })
  }

  render() {
    return (
      <div>
      {
        (this.state.data_loading) ?
        <div className = "container">
          <p>loading...</p>
        </div>
        :
        <div className = "container">
          <div className = "section">
            <Shb_breadcrumb cat_title = {this.state.cat_title} />
          </div>
          <div className = "divider"></div>
          <div className = "section">
            <h4>{this.state.article_display.post_title}</h4>
            <p>{this.state.article_display.updatedAt.toDateString()} by <span><a className = "black-text author_link" href=""><bold>{this.state.author}</bold></a></span></p>
          </div>
          <div className = "section">
            <div className = "browser-default article_content">
              <ReactQuill
                theme = "bubble"
                defaultValue={this.state.article_display.post_text}
                readOnly='true'
              />
            </div>
          </div>
          <div className = "divider"></div>
          <div className = "section author_section">
            <h6>Author</h6>
            <div className = "row">
              <div className = "col xl1 l1 m1 s2 left" style={{ position: 'relative', paddingLeft: '0.75rem'}}>
                <FoodieAvatar user_id = {this.state.article_display.user_id} />
              </div>
              <div className = "col xl11 l11 m11 s10">
                <h6>{this.state.author}</h6>
                <p>{this.state.authorIntro}</p>
              </div>
            </div>
          </div>
          <div className = "divider"></div>
          <div className = "section">
          </div>
        </div>
      }
      </div>
    )
  }
}
