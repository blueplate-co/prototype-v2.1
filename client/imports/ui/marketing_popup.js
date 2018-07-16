import React, { Component } from "react";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { Meteor } from 'meteor/meteor';

import SignUp from './signup.js'

export default class MarketingPopup extends Component {

  constructor(props) {
    super(props);
    this.handleYes = this.handleYes.bind(this);
    this.handleNo = this.handleNo.bind(this);
    this.handleRestart = this.handleRestart.bind(this);
    this.handleNextStep = this.handleNextStep.bind(this);
    this.handleChooseChef = this.handleChooseChef.bind(this);
    this.handleChooseFoodie = this.handleChooseFoodie.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleDistrictChange =this.handleDistrictChange.bind(this);
    this.handleDistrictConfirm = this.handleDistrictConfirm.bind(this);
    this.handleDistrictBack = this.handleDistrictBack.bind(this);
    this.handleSignUpBack = this.handleSignUpBack.bind(this);
    this.state = {
      foodiesYes: 0,
      chefsYes: 0,
      No: 0,
      restart: false,
      path: '',
      stage: 'popup',
      chooseRole: '',
      district: '',
      startTime: new Date(),
    }
  }

  componentDidMount() {
    this.setState({
      path: FlowRouter.getQueryParam('path')
    })
  }

  handleYes = () => {
    if (this.state.foodiesYes < 1 || this.state.chefsYes < 1) {
      this.setState({
        foodiesYes: this.state.foodiesYes + 1,
        chefsYes: this.state.chefsYes + 1,
        No: 0
      })
    } else {
      this.setState({
        stage: 'callToAction',
      })
    }
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
    this.setState({
      stage: 'chooseRole',
    })
  }

  handleChooseChef = () => {
    this.setState({
      stage: 'chooseDistrict',
      chooseRole: 'Chef',
    })
  }

  handleChooseFoodie = () => {
    this.setState({
      stage: 'chooseDistrict',
      chooseRole: 'Foodie',
    })
  }

  handleClose = () => {
    this.setState({
      foodiesYes: 0,
      chefsYes: 0,
      No: 0,
    })
    $('#marketing_popup2_container').modal('close');
    Meteor.call(
      'popup_tracking.insert',
      this.state.foodiesYes,
      this.state.chefsYes,
      this.state.No,
      this.state.path,
      this.state.stage,
      this.state.chooseRole,
      this.state.district,
      this.state.startTime
    )
  }

  handleDistrictChange = (event) => {
    this.setState({
      district: event.target.value,
    })
  }

  handleDistrictConfirm = () => {
    this.setState({
      stage: 'signUp'
    })
  }

  handleDistrictBack() {
    this.setState({
      stage: 'chooseRole',
    })
  }

  handleSignUpBack() {
    this.setState({
      stage: 'chooseDistrict',
    })
  }

  render() {
    const chefsYes = [
      {
        description: "Blueplate is a platform that allows you to earn money while cooking. Would you like that?",
        img_link: "https://blueplate-images.s3.ap-southeast-1.amazonaws.com/images/large/655_jja06gsa.png"
      },
      {
        description: "Blueplate also lets you save the world while cooking great food. Would you like to be a part of this too? ",
        img_link: "https://blueplate-images.s3.ap-southeast-1.amazonaws.com/images/large/796_jj9m8wkd.png"
      },
{/**      {
        description: "Awesome! Then let’s have the best of both worlds!",
        img_link: "https://blueplate-images.s3.ap-southeast-1.amazonaws.com/images/large/39_jj9lx222.png"
      },
      {
        description: "If you said yes 3 times, then lets have the best of both worlds!",
        img_link: "https://blueplate-images.s3.ap-southeast-1.amazonaws.com/images/large/655_jja06gsa.png"
      }**/}
    ];

    const foodiesYes = [
      {
        description: "Blueplate is a platform that allows you to eat delicious homemade food all the time. Would you like that?",
        img_link: "https://blueplate-images.s3.ap-southeast-1.amazonaws.com/images/large/193_jj9p3opu.png"
      },
      {
        description: "Blueplate also lets you save the world while eating great food. Would you like to be a part of this?",
        img_link: "https://blueplate-images.s3.ap-southeast-1.amazonaws.com/images/large/796_jj9m8wkd.png"
      },
{/**      {
        description: "Awesome! Then let’s have the best of both worlds! ",
        img_link: "https://blueplate-images.s3.ap-southeast-1.amazonaws.com/images/large/831_jj9p0f5j.png"
      },
      {
        description: "If you said yes 3 times, then lets have the best of both worlds!",
        img_link: "https://blueplate-images.s3.ap-southeast-1.amazonaws.com/images/large/655_jja06gsa.png"
      }, **/}
    ];

    const reject = [
      {
        description: "Are you sure? Let's do it again.",
        img_link: "https://blueplate-images.s3.ap-southeast-1.amazonaws.com/images/original/962_jjnsixom.png"
      },
      {
        description: "Are you really sure? Let's try one more time.",
        img_link: "https://blueplate-images.s3.ap-southeast-1.amazonaws.com/images/original/14_jjnspwhu.png"
      },
      {
        description: "Very well! Have a nice day. Come back and visit when you want to join the food revolution.",
        img_link: "https://blueplate-images.s3.ap-southeast-1.amazonaws.com/images/original/911_jjnst0ap.png"
      },
    ];

    const districts = [
      {
        districtName: "Central and Western",
        region: "Hong Kong Island"
      },
      {
        districtName: "Eastern",
        region: "Hong Kong Island"
      },
      {
        districtName: "Southern",
        region: "Hong Kong Island"
      },
      {
        districtName: "Wan Chai",
        region: "Hong Kong Island"
      },
      {
        districtName: "Sham Shui Po",
        region: "Kowloon"
      },
      {
        districtName: "Kowloon City",
        region: "Kowloon"
      },
      {
        districtName: "Kwun Tong",
        region: "Kowloon"
      },
      {
        districtName: "Wong Tai Sin",
        region: "Kowloon"
      },
      {
        districtName: "Yau Tsim Mong",
        region: "Kowloon"
      },
      {
        districtName: "Islands",
        region: "New Territories"
      },
      {
        districtName: "Kwai Tsing",
        region: "New Territories"
      },
      {
        districtName: "North",
        region: "New Territories"
      },
      {
        districtName: "Sai Kung",
        region: "New Territories"
      },
      {
        districtName: "Sha Tin",
        region: "New Territories"
      },
      {
        districtName: "Tai Po",
        region: "New Territories"
      },
      {
        districtName: "Tsuen Wan",
        region: "New Territories"
      },
      {
        districtName: "Tuen Mun",
        region: "New Territories"
      },
      {
        districtName: "Yuen Long",
        region: "New Territories"
      },
    ]

    switch (this.state.stage) {
      case 'popup':
        return (
          <div id="marketing_modal_container">
            <button className="modal-close btn-floating transparent z-depth-0 waves-effect waves-red login_cancel_btn" id="cancel_signup" onClick={this.handleClose}><i className="black-text medium material-icons">close</i></button>
              <div className = "no-margin row marketing_modal">
                <div className = "marketing_image_wrapper col l6 m6 s12 hide-on-large-only">
                {
                  (this.state.restart) ?
                  <img className = "image_wrapper" src = {reject[this.state.No - 1].img_link} />
                  :
                  <img
                    className = "image_wrapper image_drop"
                    id= { (this.state.path == "chefs") ? "img" + this.state.path + this.state.chefsYes : "img" + this.state.path + this.state.foodiesYes }
                    src={ (this.state.path == "chefs") ? chefsYes[this.state.chefsYes].img_link : foodiesYes[this.state.foodiesYes].img_link }
                  />
                }
                </div>
                <div className = "col l6 m6 s12 marketing_modal_content valign-wrapper">
                  <div className = "modal-content">
                  {
                    (this.state.restart) ?
                      <h4 className = "bp-red-text center-align">{reject[this.state.No - 1].description}</h4>
                      :
                      <h4 className = "bp-red-text center-align">
                        {
                          (this.state.path == "chefs") ?
                            chefsYes[this.state.chefsYes].description
                          :
                            foodiesYes[this.state.foodiesYes].description
                        }
                      </h4>
                  }
                  {
                    (this.state.No == 3) ?
                      <div className = "row add-margin-top">
                        <div className = "col l12 m12 s12 center">
                          <button className = "btn bp-red marketing_popup_btn" onClick = {this.handleClose}>close</button>
                        </div>
                      </div>
                      :
                      (this.state.restart) ?
                        <div className = "row add-margin-top">
                          <div className = "col l12 m12 s12 center">
                            <button className = "btn bp-red marketing_popup_btn" onClick = {this.handleRestart}>again</button>
                          </div>
                        </div>
                        :
                        <div className = "row">
                          <div className = "col l6 m12 s12 center">
                            <button className = "btn bp-red marketing_popup_btn add-margin-top" onClick = {this.handleYes}>Yes</button>
                          </div>
                          <div className = "col l6 m12 s12 center">
                            <button className = "btn bp-red marketing_popup_btn add-margin-top" onClick = {this.handleNo}>No</button>
                          </div>
                        </div>
                  }
                </div>
              </div>
              <div className = "marketing_image_wrapper col l6 m6 s12 hide-on-med-and-down">
              {
                (this.state.restart) ?
                  <img className = "image_wrapper" src = {reject[this.state.No - 1].img_link} />
                :
                  <img
                    className = "image_wrapper image_drop"
                    id= { (this.state.path == "chefs") ? "img" + this.state.path + this.state.chefsYes : "img" + this.state.path + this.state.foodiesYes }
                    src={ (this.state.path == "chefs") ? chefsYes[this.state.chefsYes].img_link : foodiesYes[this.state.foodiesYes].img_link }
                  />
                }
              </div>
            </div>
          </div>
        )
        break;
      case 'callToAction':
        return (
          <div className = "modal-content marketing_modal_content valign-wrapper">
            <button className="modal-close btn-floating transparent z-depth-0 waves-effect waves-red login_cancel_btn" id="cancel_signup" onClick={this.handleClose}><i className="black-text medium material-icons">close</i></button>
            <div className = "container">
              <h4 className = "bp-red-text center-align">Awesome! Then let’s have the best of both worlds!</h4>
              <div className = "row add-margin-top">
                <div className = "col l12 m12 s12 center">
                  <button className = "btn bp-red marketing_popup_btn" onClick = {this.handleNextStep}>go!</button>
                </div>
              </div>
            </div>
          </div>
        )
        break;
      case 'chooseRole':
        return (
          <div className = "modal-content marketing_modal_content valign-wrapper">
            <button className="modal-close btn-floating transparent z-depth-0 waves-effect waves-red login_cancel_btn" id="cancel_signup" onClick={this.handleClose}><i className="black-text medium material-icons">close</i></button>
            <div className = "container">
              <div className = "row">
                <h5 className = "bp-red-text center-align">Thanks for showing your interest to join the food revolution! Lets make Blueplate a reality in your district!</h5>
              </div>
              <div className = "row">
                <h2 className = "bp-red-text center-align">Do you love making food, or you rather prefer eating?</h2>
              </div>
              <div className = "row">
                <h5 className = "bp-red-text center-align">I am a</h5>
              </div>
              <div className = "row">
                <div className = "col l6 m6 s6">
                  <button className = "btn bp-red marketing_popup_btn right" onClick = {this.handleChooseChef}>chef</button>
                </div>
                <div className = "col l6 m6 s6">
                  <button className = "btn bp-red marketing_popup_btn left" onClick = {this.handleChooseFoodie}>foodie</button>
                </div>
              </div>
            </div>
          </div>
        )
        break;
      case 'chooseDistrict':
        return (
          <div className = "modal-content marketing_modal_content valign-wrapper">
          <button className="modal-close btn-floating transparent z-depth-0 waves-effect waves-red login_cancel_btn" id="cancel_signup" onClick={this.handleClose}><i className="black-text medium material-icons">close</i></button>
            <div className = "container">
              <div className = "row">
                <h5 className = "bp-red-text center-align">Get Blueplate to your district</h5>
              </div>
              <div className = "row">
                <h2 className = "bp-red-text center-align">Which district do you live in?</h2>
              </div>
              <div className = "row">
                <select ref="dropdown" className="browser-default" id="district_selection" onChange={this.handleDistrictChange} value={(this.state.district)?this.state.district:""}>
                  <option value="">Choose a district</option>
                  {
                    districts.map((item, index) => {
                      return (
                        <option key = {index} value = {item.districtName}>{item.districtName}</option>
                      )
                    })
                  }
                </select>
              </div>
              <div className = "row">
                <div className = "col s12 m6 l6 center">
                  <button className = "btn bp-red marketing_popup_btn center-align" onClick = {this.handleDistrictBack}>back</button>
                </div>
                <div className = "col s12 m6 l6 center">
                  <button className = "btn bp-red marketing_popup_btn center-align" onClick = {this.handleDistrictConfirm} disabled={(!this.state.district)?true:false}>next</button>
                </div>
              </div>
            </div>
          </div>
        )
        break;
      case 'signUp':
        return (
          <div className = "modal-content marketing_modal_content valign-wrapper">
            <button className="modal-close btn-floating transparent z-depth-0 waves-effect waves-red login_cancel_btn" id="cancel_signup" onClick={this.handleClose}><i className="black-text medium material-icons">close</i></button>
            <SignUp
              title = "One last step! Just fill your information to sign up now."
              district = {this.state.district}
              role = {this.state.chooseRole}
              handleBack = {this.handleSignUpBack}
            />
          </div>
        )
        break;
    }
  }
}
