import React, {Component} from 'react';
import './become_chef.css';

export default class BecomeChef extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <section className="become-chef-container">
                <div className="container">
                    <div className="become-chef-wrapper">
                        <div className="row">
                            <div className="col l7 s12 m12 become-chef-content">
                                <h5>Hey there!</h5>
                                <p>Setting up your kitchen and enjoy our promotion of HK$200 credit reward for every 4 dishes listed</p>
                                <button className="btn btn-primary btn-become-homechef">Become home chef</button>
                            </div>
                            <div className="col l5 s12 m12">
                                <img width="80%" src="https://s3-ap-southeast-1.amazonaws.com/blueplate-images/images/yahoobecome.png" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}