import React, { Component } from 'react';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import Rating from './rating';
import ProgressiveImages from './progressive_image';
import KitchenBanner from './kitchen_banner';

export default class KitchenCard extends Component {

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      hasBanner: false,
    }
  }

  componentDidMount() {
    if (this.props.bannerProfileImg) {
      this.setState({
        hasBanner: true,
      })
    }
  }

  handleClick = () => {
    // this.props.popup(this.props);
    Meteor.call('kitchen.view', this.props.kitchenId, this.props.userId);;
    var link = "/kitchen/" + this.props.kitchenId+ "/"
    FlowRouter.go(link)
  }

  render() {
    var randomNumber = Math.floor(Math.random() * 4);
    const backgroundColor = [
      {
        name: "blue",
        code: "#56AACD",
        text: "#4E88A1"
      },
      {
        name: "orange",
        code: "#EFAB1E",
        text: "#B98A2B"
      },
      {
        name: "red",
        code: "#EB5F55",
        text: "#B6534D"
      },
      {
        name: "green",
        code: "#B1DBBE",
        text: "#92AD96"
      },
    ];

    const titleStyle = {
      color: backgroundColor[randomNumber].text,
      opacity: '1'
    }

    return (
      <div className="col xl4 l4 m6 s12 modal-trigger kitchen-wrapper" onClick={ () => this.handleClick() }>
        <div className="kitchen-images-thumbnail" style =  {{ background: backgroundColor[randomNumber].code }}>
          {
            (this.state.hasBanner) ?
              <ProgressiveImages
                large={ this.props.bannerProfileImg.large }
                small={ this.props.bannerProfileImg.small }
              />
            :
              <div className = "section">
                <KitchenBanner color = {backgroundColor[randomNumber].text} />
                <h5 className = "left-align" style = {titleStyle}>
                  { (this.props.kitchenName) ? this.props.kitchenName : this.props.chefName }
                </h5>
              </div>
          }
        </div>
        <div className="row no-margin text-left" style={{ position: 'relative' }}>
          <h5 className="dish-title">{ (this.props.kitchenName) ? this.props.kitchenName : this.props.chefName }</h5>
        </div>
        <div className="row no-margin">
          <div className="col l12 m12 dish-rating no-padding text-left">
            <Rating rating={this.props.averageRating}/>
            <span className="order-count">{ this.props.orderCount }</span>
          </div>
        </div>
      </div>
    );
  }
}
