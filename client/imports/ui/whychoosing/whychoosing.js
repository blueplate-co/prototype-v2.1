import React, {Component} from 'react';
import './whychoosing.css';

export default class WhyChoosing extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <section className="why-choosing-container">
                <div className="container">
                    <h2>Why choosing us</h2>
                    <div className="row">
                        <div className="col l4 m12 s12 choosing-item">
                            <div className="choosing-image-container">
                                <img src="https://s3-ap-southeast-1.amazonaws.com/blueplate-images/images/choosing1.png" />
                            </div>
                            <p className="choosing-content">Home-made dishes made with love</p>
                            <p className="choosing-content">Unlike most restaurants, our homechefs who are all passionate about cooking treat you as one of their own family member. They will do everything to ensure that their ingredients are fresh, their supplies are recent and their food are safe. They allocate their time to ensure that they prepare the most authentically… made home dishes custom to your taste. So if you are tired of watered down versions of different cuisines, come on board and ready yourself for a gastronomic journey.</p>
                        </div>
                        <div className="col l4 m12 s12 choosing-item">
                            <div className="choosing-image-container">
                                <img src="https://s3-ap-southeast-1.amazonaws.com/blueplate-images/images/choosing2.png" />
                            </div>
                            <p className="choosing-content">Your payment is protected until you enjoy your meal</p>
                            <p className="choosing-content">We are alway be here to listen to your feedback on any dishes you tried at Blueplate so that we can build up a better community. We gurantee to refund in case you are not happy with your dishes for a reason.</p>
                        </div>
                        <div className="col l4 m12 s12 choosing-item">
                            <div className="choosing-image-container">
                                <img src="https://s3-ap-southeast-1.amazonaws.com/blueplate-images/images/choosing3.png" />
                            </div>
                            <p className="choosing-content">We are alway here to support.</p>
                            <p className="choosing-content">Drop us a message if you need any help! We will be able to assist in a wide diversity of issues, whether it is market research, logistics support, facilitating purchases or even communication. Just drop us a note and we will assist to the best of our abilities!</p>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}