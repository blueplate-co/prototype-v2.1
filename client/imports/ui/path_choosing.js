import React, { Component } from 'react';

export default class PathOption extends Component {
  constructor(props) {
    super(props);
  }

  get_path() {
    return [
      {
        link: "https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/BeHomecook.svg",
        name: "create your first dish",
        details: "Create your first dish at blueplate",
        redirect: "/cooking/dishes",
      }, {
        link: "https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/ProfilePreview.svg",
        name: "preview kitchen profile",
        details: "Have a quick look at your own profile. This is how other users are going to see you",
        redirect: "",
      }, {
        link: "https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/Dashboard.svg",
        name: "go to kitchen dashboard",
        details: "The dashboard is the main page of your kitchen that contains all information you \
        need to run your kitchen at blueplate",
        redirect: "/cooking/dashboard",
      }
    ];
  }

  render_path = () => {
    return this.get_path().map((path) => {
      return (
        <div className='col xl4 l4 m12 s12'>
          <div className='card z-depth-0 path_card'>
            <div className='card-content'>
              <a href={path.redirect}>
                <img src={path.link} className="path_icons"/>
                <h6 className='icon_titles bp-blue-text center-align' id='create_first_dish'>{path.name}</h6>
                <p className='bp-blue-text'>{path.details}</p>
              </a>
            </div>
          </div>
        </div>
      )
    })
  }

  render() {
    return (
      <div className="path_container">
        <div className="row center-align">
          <div className="col xl12 l12 m12 s12">
            <h5 className ="bp-blue-text">
              Thanks for taking your time filling in your profile.
              All is done. Please choose where you would like to go.
            </h5>
          </div>
        </div>
        <div className="row center-align">
          {this.render_path()}
        </div>
      </div>
    );
  }
}
