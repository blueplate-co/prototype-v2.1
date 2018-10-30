import React, { Component } from 'react';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

const ShowroomBanner = props => {

  const bannerStyle = {
    showroom_banner: {
      width: '100%',
      overflow: 'hidden',
    },
    banner_img: {
      minHeight: '276px',
      height: '100%',
      backgroundImage: `url('https://s3-ap-southeast-1.amazonaws.com/blueplate-images/images/thu_aug_30_2018_banner_small_resize.png')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center center',
      backgroundRepeat: 'no-repeat',
    },
    banner_button: {
      width: '150px',
      marginLeft: '0px',
      marginTop: '40px',
      marginBottom: '40px'
    },
    promo_title: {
      marginBottom: '0px'
    }
  }

  handleClick = () => {
    if  (Meteor.userId()) {
      if (props.kitchenExisted) {
        FlowRouter.go('/profile/show_homecook_profile')
      } else {
        FlowRouter.go('/profile/create_homecook_profile')
      }
    } else {
      FlowRouter.go('/')
      util.loginAccession("/profile/show_homecook_profile");
    }
  }

  return (
    <div className = "row card" style={bannerStyle.showroom_banner}>
      <div className = "col l6 m12 s12" style = {bannerStyle.banner_img}>
        <div className = "card-content">
          <img src = "https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/logo.svg" className = "left" style={bannerStyle.banner_logo}/>
        </div>
      </div>
      <div className="col l6 m12 s12">
        {
          (props.kitchenExisted) ?
          <div className = "card-content">
            <h6>Hey Chef, you've already started!</h6>
            <p><bold>Why not finish setting up your kitchen and enjoy our promotion of</bold></p>
            <h4 className = "bp-blue-text" style = {bannerStyle.promo_title}>HK$200 credit reward</h4>
            <p>for every 4 dishes listed</p>
            <button className = "btn left" style = {bannerStyle.banner_button} onClick={handleClick}>continue</button>
          </div>
          :
          <div className = "card-content">
            <h6>Hey Chef,</h6>
            <h6>Setting up your kitchen and enjoy our promotion of</h6>
            <h4 className = "bp-blue-text" style = {bannerStyle.promo_title}>HK$200 credit reward</h4>
            <p>for every 4 dishes listed</p>
            <button className = "btn left" style = {bannerStyle.banner_button} onClick={handleClick}>start now</button>
          </div>
        }
      </div>
    </div>
  )
}

export default ShowroomBanner
