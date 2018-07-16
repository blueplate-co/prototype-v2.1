import React, { Component } from "react";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

export default class MarketingPopup0 extends Component {

  constructor(props) {
    super(props);
    this.handleYes = this.handleYes.bind(this);
    this.handleNo = this.handleNo.bind(this);
    this.state = {
      foodiesYes: 0,
      chefsYes: 0,
      No: 0,
      restart: false,
      path: '',
    }
  }

  componentDidMount() {
    this.setState({
      path: FlowRouter.getQueryParam('path')
    })
  }

  handleYes = () => {
    this.setState({
      foodiesYes: this.state.foodiesYes + 1,
      chefsYes: this.state.chefsYes + 1,
      No: 0
    })
  }

  handleNo = () => {
    this.setState ({
      No: this.state.No + 1,
      restart: true
    })
  }

  handleRestart = () => {
    this.setState({
      chefsYes: 0,
      foodiesYes: 0,
      restart: false,
    })
  }

  handleNextStep = () => {
    alert('hello');
  }

  handleClose() {
    $('#marketing_popup_container').modal('close');
  }

  render() {
    const chefsYes = [
      "Would you like to earn money while cooking?",
      "Would you like to save the world with your food?",
      "Would you like to do both at the same time?",
      "If you said yes 3 times, then lets have the best of both worlds!"
    ];

    const foodiesYes = [
      "Would you like to eat delicious homemade food all the time?",
      "Would you like to save the world?",
      "Would you like to do the two things together?",
      "If you said yes 3 times, then lets have the best of both worlds!"
    ];

    const reject = [
      "Are you sure? Let's do it again.",
      "Are you really sure? Let's try one more time.",
      "Very well! Have a nice day. Come back and visit when you want to join the food revolution."
    ];

    return(
      <div id="marketing_modal_container" >
        <div className = "marketing_image_wrapper">
          <div className = "container">
            <div className = "section valign-wrapper center-align center">
              <img src="https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/logo.svg"/>
            </div>
          </div>
        </div>
        <div className = "modal-content">
          <div className = "row">
            <div className = "col l12 m12 s12">
              {
                (this.state.restart) ?
                  <h6 className = "bp-red-text center-align">{reject[this.state.No - 1]}</h6>
                  :
                  <h6 className = "bp-red-text center-align">
                    {
                      (this.state.path == "chefs") ?
                        chefsYes[this.state.chefsYes]
                      :
                        foodiesYes[this.state.foodiesYes]
                    }
                  </h6>
              }
            </div>
          </div>
            {
              (this.state.chefsYes == 3 || this.state.foodiesYes == 3) ?
              <div className = "row">
                <div className = "col l12 m12 s12 center">
                  <button className = "btn bp-red marketing_popup_btn" onClick = {this.handleNextStep}>go!</button>
                </div>
              </div>
              :
              (this.state.No == 3) ?
                <div className = "row">
                  <div className = "col l12 m12 s12 center">
                    <button className = "btn bp-red marketing_popup_btn" onClick = {this.handleClose}>close</button>
                  </div>
                </div>
                :
                (this.state.restart) ?
                  <div className = "row">
                    <div className = "col l12 m12 s12 center">
                      <button className = "btn bp-red marketing_popup_btn" onClick = {this.handleRestart}>again</button>
                    </div>
                  </div>
                  :
                  <div className = "row">
                    <div className = "col l6 m6 s6 center">
                      <button className = "btn bp-red marketing_popup_btn" onClick = {this.handleYes}>Yes</button>
                    </div>
                    <div className = "col l6 m6 s6 center">
                      <button className = "btn bp-red marketing_popup_btn" onClick = {this.handleNo}>No</button>
                    </div>
                  </div>
            }
        </div>
      </div>
    )
  }
}
