import React, { Component } from 'react';
import BouncingLoader from '../bouncing_loader/bouncing_loader.js';
import AdminListDish from './admin_list_dish.js';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { withTracker } from 'meteor/react-meteor-data';

export class AdminEditFunc extends Component {
    constructor(props) {
        super(props);

        this.state = {
            listDishes: []
        }
    };

    filterAminUser(email) {
        var hasPermission = false;
        var arr_email = ['trang.nguyen@blueplate.co', 'tan.pham@blueplate.co', 'the.phan@blueplate.co',
                            'michael.lin@blueplate.co', 'keith.chan@blueplate.co', 'tracy.simaika@blueplate.co'];
        
        for (var i = 0; i < arr_email.length; i++) {
            if (arr_email[i] == email) {
                hasPermission = true;
                break;
            }
        }
        return hasPermission;
    }

    componentDidMount() {
        $(window).scrollTop(0);
        $('.page-footer').hide();
        $('#top-navigation-container').hide();

        if (Meteor.user()) {
            var email = Meteor.user().emails[0].address;
            var validEmail = email.indexOf('@blueplate.co') > 0;
            if (!validEmail && !this.filterAminUser(email)) {
                FlowRouter.go('/main');
            }
        }
        
        // Meteor.call('admin.get_list_dish', (err, res) => {
        //     if (res) {
        //         this.setState({ listDishes: res });
        //     }
        // });
    }

    render() {
        return (
            (this.props.listDishes.length > 0) ? 
                <div className="container">
                    <AdminListDish listDishes={this.props.listDishes} />
                </div>
            :
                <BouncingLoader />
        );
    }
}

export default withTracker(props => {
    return {
        currentUser: Meteor.user(),
        listDishes: Dishes.find({deleted: false}).fetch(),
    };
})(AdminEditFunc);