import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { Session } from 'meteor/session';

export default class SellerHandbook extends Component {
  constructor(props) {
    super(props)
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.handleClikc = this.handleClick.bind(this);
    this.state = {
      mouseOver: -1,
      categories: [],
    }
  }

  handleMouseLeave = (e) => {
    this.setState({
      mouseOver: false
    })
  }

  handleClick = (item, e) => {
    Session.set('cat_selected', item._id)
    console.log(Session.get('cat_selected'))
    const link = '/seller-handbook/category/' + item.cat_title
    FlowRouter.go(link);
  }

  componentDidMount() {
    window.scrollTo(0,0);
    Meteor.call('category.display', (error, result) => {
      if (result) {
        this.setState({
          categories: result
        });
      }
    })
  }

  category_display_list = () => {
    return this.state.categories.map((item, index) => {
      return (
        <div className = "col xl4 l4 m6 s12 center">
          <div
            key = {index}
            className = {
              this.state.mouseOver === index ?
                "card hoverable cat_display_container"
                :
                "card hoverable cat_display_container z-depth-0"
              }
            onMouseOver= {(e) => {(this.setState({mouseOver: index}))}}
            onMouseLeave={this.handleMouseLeave}
            onClick={() => this.handleClick(item)}
          >
            <a href="">
              <div className = "card-image">
                <img className = "iconDisplay" src = {item.icon_link.origin} />
              </div>
              <div className = "card-content left-align">
                <h5>{item.cat_title}</h5>
                <p>{item.cat_description}</p>
                <br />
                <p>see all articles ({item.article_count})</p>
              </div>
            </a>
          </div>
        </div>
      )
    })
  }

  render() {
    return (
      <div className = "container">
        <div className = "section">
          <img className = "shb_logo center-align" src="https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/BPLogo_sysmbol.svg" />
          <h4 className = "center-align bp-blue-text">Seller Handbook</h4>
          <p className = "center-align">This is a business guide for our partner</p>
        </div>
        <div className = "section">
        <h6 className = "center-align">Categories</h6>

          <div className = "row">
            {
              (this.state.categories !== []) ?
              this.category_display_list()
              :
              <p>loading...</p>
            }
          </div>
        </div>
      </div>
    )
  }
}
