import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import Shb_breadcrumb from './shb_breadcrumb.js';

export default class ArticleListDisplay extends Component {
  constructor(props) {
    super(props)
    this.state = {
      category: '',
      articles: '',
      height: 0,
      cat_icon_link: '',
    }
  }

  componentDidMount() {
    window.scrollTo(0,0);
    Meteor.call('category.find', FlowRouter.getParam('category') , (error, result) => {
      if (result) {
        this.setState({
          category: result,
          cat_icon_link: result.icon_link.origin
        })
        Meteor.call('article.display', this.state.category._id, (error, result) => {
          if (result) {
            this.setState({
              articles: result
            })
          }
        })
        const height = this.divElement.clientHeight;
        this.setState({ height });
      }
    })
  }

  articles_count = () => {
    const count = this.state.articles.length
    if (count > 1) {
      var description = "articles";
    } else {
      var description = "article";
    }
    return count + " " + description
  }

  article_list = () => {
    return this.state.articles.map((item, index) => {
      const article = document.createElement('article')
      article.innerHTML = item.post_text
      if (article.getElementsByTagName("img")[0]) {
        var img_link = article.getElementsByTagName("img")[0].src
      } else {
        var img_link = ""
      }
      const p = article.textContent
      const author = Profile_details.findOne({user_id: item.user_id}).foodie_name
      const article_link = "/seller-handbook/articles/" + item._id;
      return (
        <div className = "articlie_display_list section" key = {index}>
          <div className = "row">
            <div className = "col xl2 l2 m2 s2">
              <div className = "shb_article_thumbnails">
                <img className = "shb_thumbnail" src = {img_link} />
              </div>
            </div>
            <div className = "col xl10 l10 m10 s10">
              <a href={article_link} className = "post_title_link"><h5 className = "black-text">{item.post_title}</h5></a>
              <p className = "truncate">{p}</p>
              <a href="" className = "post_title_link"><h6 className = "black-text">by {author}</h6></a>
              <p>{item.updatedAt.toDateString()}</p>
            </div>
          </div>
        </div>
      )
    })
  }

  render() {
    const iconStyle = {
    backgroundImage: `url(${this.state.cat_icon_link})`,
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    height: this.state.height
    }

    return (
      <div className = "container">
        <div className = "section">
          <Shb_breadcrumb cat_title = {this.state.category.cat_title} />
          <div className = "row">
            <div className = "col xl2 l2 m2 s2">
              <div className = "shb_icon_display" style = {iconStyle}>
              </div>
            </div>
            <div className = "col xl10 l10 m10 s10" ref = { (divElement) => this.divElement = divElement}>
              <h4>{this.state.category.cat_title}</h4>
              <p>{this.state.category.cat_description}</p>
            </div>
          </div>
        </div>
        <div className = "section">
          <div className = "row">
            <div className = "col xl12 l12 m12 s12">
              <ul className="collection" id="article_list_header">
                <li className="collection-item"><h6>{this.articles_count()}</h6></li>
              </ul>
            </div>
          </div>
        </div>
        <div className = "section">
        {
          this.state.articles ?
            this.article_list()
          :
          <p>loading...</p>
        }
        </div>
      </div>
    )
  }
}
