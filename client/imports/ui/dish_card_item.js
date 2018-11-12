import React, { Component } from 'react';

export default class DishItem extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="dish-card col l3 m6 s12">
                <div className="thumbnail" style={{ backgroundImage: "url(https://www.telegraph.co.uk/content/dam/Travel/2017/February/italy-food-Ribollita-AP.jpg)" }}>
                    <span className="like-container">
                        <svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg"><g id="Symbols" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"><g id="ic/favorite/line/GY" stroke="#FFFFFF" stroke-width="2"><path d="M12,8 C11.33,6.268 9.453,5 7.5,5 C4.957,5 3,6.932 3,9.5 C3,16.0145833 9.79433594,21 12,21 C14.2056641,21 21,16.0139974 21,9.5 C21,6.932 19.043,5 16.5,5 C14.545,5 12.67,6.268 12,8 Z" id="Shape"></path></g></g></svg>
                    </span>
                </div>

            </div>
        )
    }
}