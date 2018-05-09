import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor'

export default class SellerHandbook extends Component {
  constructor(props) {
    super(props)
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
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

  componentDidMount() {
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
          <h4 className = "center-align">Seller Handbook</h4>
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
