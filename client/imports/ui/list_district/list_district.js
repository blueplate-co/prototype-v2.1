import React, { Component } from 'react';
import './list_district.css';

const DistrictItem = (props) => {
  return (
    <div key={props.district.name} className="district-item">
      <img src={props.district.images} />
      <div className="shadow-mask"></div>
      <span>{props.district.name}</span>
    </div>
  )
}

// App component - represents the whole app
export default class ListDistrict extends Component {

  constructor(props) {
    super(props);
    this.slideLeft = this.slideLeft.bind(this);
    this.slideRight = this.slideRight.bind(this);
    this.state = {
      position: 0,
      offsetX: 0,
      width: window.innerWidth
    }
  }

  componentDidMount() {
    this.setState({
      listLength: document.getElementsByClassName('district-item').length
    });
    if (this.state.width < 992) {
      this.setState({
        position: 0,
        offsetX: 0
      })
    }
  }

  componentWillMount() {
    window.addEventListener('resize', this.handleWindowSizeChange);
  }

  handleWindowSizeChange = () => {
    this.setState({ width: window.innerWidth },() => {
      if (this.state.width < 992) {
        this.setState({
          position: 0,
          offsetX: 0
        })
      }
    });
  };

  renderListDistrict() {
    return (
      window.util.listDistrict().map((item, index) => {
        return <DistrictItem key={index} district={item} />
      })
    )
  }

  slideLeft() {
    let cardWidth = document.getElementsByClassName('district-item')[0].offsetWidth + 10;
    let newOffset = this.state.offsetX + (cardWidth * 2);
    this.setState({ offsetX: newOffset, position: this.state.position - 2 })
  }

  slideRight() {
    let cardWidth = document.getElementsByClassName('district-item')[0].offsetWidth + 10;
    let newOffset = this.state.offsetX - (cardWidth * 2);
    this.setState({ offsetX: newOffset, position: this.state.position + 2 })
  }

  render() {
      return (
        <div>
          <section className="container" id="list-district">
            <div className="row">
              <h2>Meet your new chef!</h2>
              <div className="list-district-wrapper">
                {
                  (this.state.position > 0) ? <i className="fa fa-chevron-left list-navigator" aria-hidden="true" onClick={() => this.slideLeft()} id="left-navigator"></i> : ''
                }
                <div className="list-district-scrollable" style={{ transform: `translate(${this.state.offsetX}px, 0px)`  }}>
                  <ul>
                    { this.renderListDistrict() }
                  </ul>
                </div>
                {
                  (this.state.listLength - this.state.position > 3) ? <i className="fa fa-chevron-right list-navigator" aria-hidden="true" onClick={() => this.slideRight()} id="right-navigator"></i> : ''
                }
              </div>
            </div>
          </section>
        </div>
      )
  }

}
