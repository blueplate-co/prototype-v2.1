import React, { Component } from 'react';

// App component - represents the whole app
export default class SearchSection extends Component {

  constructor(props) {
    super(props);
    this.state = {
    }
  }

  componentDidMount() {

  }

  render() {
      return (
        <section id="search-section-wrapper">
            <div className="container" style={{ height: '100%' }}>
                <div className="content-hero">
                    <div>
                        <div className="row">
                            <h1>Homemade food beats any restaurant</h1>
                        </div>
                        <div className="row searching-form">
                            <div className="col s12 m12 l12">
                                <label>I want to</label>
                                <select className="browser-default" id="servingOption">
                                    <option value="" disabled selected>Dine in/Pick up/ Delivery</option>
                                    <option value="dinein">Dine in</option>
                                    <option value="delivery">Delivery</option>
                                    <option value="pickup">Pick up</option>
                                </select>
                            </div>
                            <div className="col s12 m12 l12">
                                <label>at</label>
                                <select className="browser-default" id="district">
                                    <option value="" disabled selected>Choose your district</option>
                                    <option value="Central and Western">Central and Western</option>
                                    <option value="Eastern">Eastern</option>
                                    <option value="Southern">Southern</option>
                                    <option value="Wan Chai">Wan Chai</option>
                                    <option value="Sham Shui Po">Sham Shui Po</option>
                                    <option value="Kowloon City">Kowloon City</option>
                                    <option value="Kwun Tong">Kwun Tong</option>
                                    <option value="Wong Tai Sin">Wong Tai Sin</option>
                                    <option value="Yau Tsim Mong">Yau Tsim Mong</option>
                                    <option value="Islands">Islands</option>
                                    <option value="Kwai Tsing">Kwai Tsing</option>
                                    <option value="North">North</option>
                                    <option value="Sai Kung">Sai Kung</option>
                                    <option value="Sha Tin">Sha Tin</option>
                                    <option value="Tai Po">Tai Po</option>
                                    <option value="Tsuen Wan">Tsuen Wan</option>
                                    <option value="Tuen Mun">Tuen Mun</option>
                                    <option value="Yuen Long">Yuen Long</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
      )
  }

}
