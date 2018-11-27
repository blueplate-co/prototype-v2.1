import React, {Component} from 'react';
import './whychoosing.css';

export default class WhyChoosing extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hidden: true
        }
    }

    render() {
        return (
            <section className="why-choosing-container">
                <div className="container">
                    <h2>Why choosing us</h2>
                    <div className={(this.state.hidden) ? 'row toggle-content hidden' : 'row toggle-content open'}>
                        <div className="col l4 m12 s12 choosing-item">
                            <div className="choosing-image-container">
                                <img src="https://s3-ap-southeast-1.amazonaws.com/blueplate-images/images/choosing1.png" />
                            </div>
                            <p className="choosing-content-title">Truly home-cook food</p>
                            <p className="choosing-content">Have you ever had the opportunity to pause whether restaurant prices are justified? The truth is, most restaurants charge high prices not because of the quality of the food. The prices in a restaurant most often incorporates other non-food costs, such as expensive rental fees or labour costs. To maintain profit, most restaurants must cut corners and use lower quality food. Despite heavy regulations not every restaurant adheres to it whenever possible. To ensure higher turnover of customers to serve more orders, some restaurants need to use ready made or processed food ingredients to produce their dishes. As a result, the price of the dining experience may be disconnected with the price you are paying.</p>
                            <p className="choosing-content">In comparison, the cost of homecooked food reflects mostly the quality of the ingredient. You can be certain that the price reflects only the production cost and the finest of ingredients. Furthermore, home chefs usually ensure their own kitchens are hygienic and safe to cook food for their family members. Whenever a home chef prepares a dish crafted specifically for you, instead of mass production they can ensure each dish is flavoured to perfection, prepared in exact accordance to traditional recipes.</p>
                        </div>
                        <div className="col l4 m12 s12 choosing-item">
                            <div className="choosing-image-container">
                                <img src="https://s3-ap-southeast-1.amazonaws.com/blueplate-images/images/choosing2.png" />
                            </div>
                            <p className="choosing-content-title">Food safety</p>
                            <p className="choosing-content">At the current moment, Blueplate is the only online platform that has engaged a professional food safety agent, Intertek, to ensure food prepared at home is safe. This ranges from training, to providing a crisis response hotline, our web platform is the first of its kind to strive to extend legal backups and services to all users, whether it is home chefs or customers, to ensure that everyone has an enjoyable and safe dining experience.</p>
                        </div>
                        <div className="col l4 m12 s12 choosing-item">
                            <div className="choosing-image-container">
                                <img src="https://s3-ap-southeast-1.amazonaws.com/blueplate-images/images/choosing3.png" />
                            </div>
                            <p className="choosing-content-title">We forms a community</p>
                            <p className="choosing-content">Aside from just being an internet project, Blueplate also aims to be a community building project. Our aim is to ensure that homemade food is made widely available to everyone around the city. Furthermore, we aim to show that for any singular dish or type of food, the homemade equivalent will be both more delicious and healthier. With big food corporations dominating information and perception on food, different cuisine types as well as the impersonal nature of restaurants, we aim to provide an alternative where we open your eyes to the delicious home chefs around your neighbourhood who can provide a family friendly environment for you.</p>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col l12 m12 s12 btn-toggle-content" onClick={() => { this.setState({ hidden: !this.state.hidden }) }}>
                            {
                                (this.state.hidden) ? <span>Show more</span> : <span>Show less</span>
                            }
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}