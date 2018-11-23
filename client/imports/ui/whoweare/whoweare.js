import React, {Component} from 'react';
import './whoweare.css';

export default class WhoWeAre extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <section className="who-we-are-container container">
                <div className="row">
                    <div className="col l7 m12 s12">
                        <h2>Who We Are</h2>
                        <p>Blueplate is the online homemade food market platform dedicated to your every food related need. We connect aspiring chefs who cooks food with passion and love to share their best reciept to orthers with truely foodies who are looking for your next unique homemade meal. </p>
                    </div>
                    <div className="col l5 m12 s12">
                        <img src="https://s3-ap-southeast-1.amazonaws.com/blueplate-images/images/whoweare.png" />
                    </div>
                </div>
            </section>
        )
    }
}