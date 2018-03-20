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
      }, {
        link: "https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/ProfilePreview.svg",
        name: "preview kitchen profile",
      }, {
        link: "https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/Dashboard.svg",
        name: "go to kitchen dashboard",
      }
    ];
  }

  render_path = () => {
    return this.get_path().map((path) => {
      return (
        <div className='col xl4 l4 m12 s12'>
          <div className='card z-depth-0 path_card'>
            <div className='card-content'>
              <a>
                <img src={path.link} className="path_icons"/>
                <h6 className='icon_titles bp-blue-text center-align' id='create_first_dish'>{path.name}</h6>
              </a>
            </div>
          </div>
        </div>
      )
    })
  }

  render() {
    return (
      <div className="path_container valign-wrapper">
        <div className="row center-align">
          {this.render_path()}
        </div>
      </div>
    );
  }
}
