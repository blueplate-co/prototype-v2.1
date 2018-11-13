import React, { Component } from 'react';
import './list_district.css';

const DistrictItem = (props) => {
  return (
    <div key={props.district} className="district-item">
      <img src="https://ae01.alicdn.com/kf/HTB1CDyqNVXXXXXEapXXq6xXFXXXV/Beibehang-decora-o…do-Papel-De-Parede-3d-Hong-Kong-noite-de-hotel-restaurante.jpg_640x640.jpg" />
      <div className="shadow-mask"></div>
      <span>{props.district}</span>
    </div>
  )
}

// App component - represents the whole app
export default class ListDistrict extends Component {

  constructor(props) {
    super(props);
    this.state = {
    }
  }

  componentDidMount() {}

  renderListDistrict() {
    return (
      window.util.listDistrict().map((item, index) => {
        return <DistrictItem key={item} district={item} />
      })
    )
  }

  render() {
      return (
        <div>
          <section className="container" id="list-district">
            <div className="row">
              <h2>Explore new district (meet our chefs)</h2>
              <div className="list-district-wrapper">
                <ul>
                  { this.renderListDistrict() }
                </ul>
              </div>
            </div>
          </section>
        </div>
      )
  }

}
