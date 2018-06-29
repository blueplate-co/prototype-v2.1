import React, { Component } from 'react';

export default class KitchenBanner extends Component {

  constructor(props) {
    super(props)
  }

  render () {
    return (
      <svg className = 'kitchenBanner' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 250">
        <title>kitchenBanner</title>
        <g className="cls-1">
          <g id="Layer_1" data-name="Layer 1">
            <g className="cls-10" style = {{stroke: this.props.color}}><line className="cls-11" x1="206.18" y1="230.25" x2="389.82" y2="230.25"/><polyline className="cls-11" points="280.73 230.25 280.73 117.52 224.36 117.52 224.36 230.25"/><line className="cls-11" x1="226.18" y1="166.61" x2="280.73" y2="166.61"/><polyline className="cls-11" points="295.58 141.16 295.58 157.52 315.58 157.52 315.58 141.16"/><line className="cls-11" x1="293.76" y1="141.16" x2="317.39" y2="141.16"/><line className="cls-11" x1="326.18" y1="126.61" x2="368" y2="126.61"/><line className="cls-11" x1="356.64" y1="126.61" x2="356.64" y2="139.34"/><line className="cls-11" x1="341.18" y1="126.61" x2="341.18" y2="135.7"/><circle className="cls-11" cx="341.64" cy="142.07" r="6.36"/><circle className="cls-11" cx="356.64" cy="143.89" r="4.55"/><line className="cls-11" x1="305.58" y1="141.16" x2="305.58" y2="137.52"/><polyline className="cls-11" points="284.36 161.16 371.64 161.16 371.64 230.25"/><rect className="cls-11" x="280.73" y="177.52" width="56.36" height="52.73"/><line className="cls-11" x1="337.09" y1="177.52" x2="337.09" y2="161.16"/><line className="cls-11" x1="362.55" y1="177.52" x2="362.55" y2="208.43"/><line className="cls-11" x1="270.73" y1="138.43" x2="270.73" y2="194.8"/><line className="cls-11" x1="288" y1="186.61" x2="328" y2="186.61"/><path className="cls-11" d="M338.91,68.8V40.25a10,10,0,0,0-20,0V69a37.26,37.26,0,0,0-26.82,35.76h74.55A37.27,37.27,0,0,0,338.91,68.8Z"/>
            </g>
          </g>
        </g>
      </svg>
    )
  }


}
