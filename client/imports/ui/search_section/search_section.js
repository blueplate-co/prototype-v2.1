import React, { Component } from 'react';
import './search_section.css';

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
                            <h1>Homemade food, exclusively made for you</h1>
                        </div>
                        <div className="row searching-form">
                            <div className="col s12 m6 l4">
                                <label>I want to</label>
                                <select className="browser-default" id="servingOption">
                                    <option value="" disabled defaultValue>Dine in/Pick up/ Delivery</option>
                                    <option value="dinein">Dine in</option>
                                    <option value="delivery">Delivery</option>
                                    <option value="pickup">Pick up</option>
                                </select>
                            </div>
                            <div className="col s12 m6 l4">
                                <label>at</label>
                                <select className="browser-default" id="district">
                                    <option value="" disabled defaultValue>Choose your district</option>
                                    {
                                        window.util.listDistrict().map((item, index) => {
                                            return (
                                                <option key={index} value={item.name}>{item.name}</option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                            <div className="col l4 m3 s6">
                                <button className="btn" id="btn-search">Search</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
      )
  }

}