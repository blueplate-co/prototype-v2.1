import React, { Component } from 'react';
import './list_district.css';

const DistrictItem = (props) => {
  return (
    (props.scrollable) ? (
      <div key={props.district.name} className="district-item">
        <img src={props.district.images} />
        <div className="shadow-mask"></div>
        <span>{props.district.name}</span>
      </div>
    ) : (
      <div key={props.district.name} className="district-item" style={{ width: `${props.width}px`, height: `${props.height}px` }}>
        <img src={props.district.images} />
        <div className="shadow-mask"></div>
        <span>{props.district.name}</span>
      </div>
    )
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
      widthWindow: window.innerWidth,
      widthItem: 240,
      heightItem: 322
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
    } else {
      let containerWidth = document.getElementsByClassName('list-district-scrollable')[0].offsetWidth;
      let itemWidth = (containerWidth - 60) / 4;
      let itemHeight = itemWidth / 3 * 4;
      this.setState({
        width: itemWidth,
        height: itemHeight
      });
    }
  }

  componentWillMount() {
    window.addEventListener('resize', this.handleWindowSizeChange);
  }

  handleWindowSizeChange = () => {
    this.setState({ widthWindow: window.innerWidth },() => {
      if (this.state.widthWindow < 992) {
        this.setState({
          position: 0,
          offsetX: 0
        })
      } else {
        let containerWidth = document.getElementsByClassName('list-district-scrollable')[0].offsetWidth;
        let itemWidth = (containerWidth - 60) / 4;
        let itemHeight = itemWidth / 3 * 4;
        this.setState({
          position: 0,
          offsetX: 0,
          width: itemWidth,
          height: itemHeight
        });
      }
    });
  };

  renderListDistrict() {
    return (
      (this.state.widthWindow > 992) ?
      (
        window.util.listDistrict().map((item, index) => {
          return <DistrictItem key={index} district={item} scrollable={false} width={this.state.width} height={this.state.heightItem} />
        })
      ) : (
        window.util.listDistrict().map((item, index) => {
          return <DistrictItem key={index} district={item} scrollable={true} />
        })
      )
    )
  }

  slideLeft() {
    let cardWidth = document.getElementsByClassName('district-item')[0].offsetWidth + 20;
    let newOffset = this.state.offsetX + (cardWidth * 2);
    this.setState({ offsetX: newOffset, position: this.state.position - 2 })
  }

  slideRight() {
    let cardWidth = document.getElementsByClassName('district-item')[0].offsetWidth + 20;
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
                  (this.state.listLength - this.state.position > 3 && this.state.position < 14) ? <i className="fa fa-chevron-right list-navigator" aria-hidden="true" onClick={() => this.slideRight()} id="right-navigator"></i> : ''
                }
              </div>
            </div>
          </section>
        </div>
      )
  }

}
