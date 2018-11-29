import React, {Component} from 'react';
import './howwork.css';

export default class HowWork extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <section className="how-it-work-container container">
                <h2>How does it work</h2>
                <div className="row">
                    <div className="col l3 m6 s12 work-step">
                        <div className="col l12 work-thumbnail" style={{ backgroundImage: "url(" + 'https://s3-ap-southeast-1.amazonaws.com/blueplate-images/images/workstep1.png' + ")" }}></div>
                        <p className="work-step-description">Step 1. Play order and pay </p>
                    </div>
                    <div className="col l3 m6 s12 work-step">
                        <div className="col l12 work-thumbnail" style={{ backgroundImage: "url(" + 'https://s3-ap-southeast-1.amazonaws.com/blueplate-images/images/workstep2.png' + ")" }}></div>
                        <p className="work-step-description">Step 2. Chat with chef</p>
                    </div>
                    <div className="col l3 m6 s12 work-step">
                        <div className="col l12 work-thumbnail" style={{ backgroundImage: "url(" + 'https://s3-ap-southeast-1.amazonaws.com/blueplate-images/images/workstep3.png' + ")" }}></div>
                        <p className="work-step-description">Step 3. Get food </p>
                    </div>
                    <div className="col l3 m6 s12 work-step">
                        <div className="col l12 work-thumbnail" style={{ backgroundImage: "url(" + 'https://s3-ap-southeast-1.amazonaws.com/blueplate-images/images/workstep4.png' + ")" }}></div>
                        <p className="work-step-description">Step 4. Enjoy homemade food</p>
                    </div>
                </div>
            </section>
        )
    }
}