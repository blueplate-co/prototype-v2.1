import React, { Component } from 'react';
import BouncingLoader from '../bouncing_loader/bouncing_loader.js';
import AdminListDish from './admin_list_dish.js';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { withTracker } from 'meteor/react-meteor-data';
import AdminListKitchen from './admin_kitchen/admin_list_kitchen.js';

export class AdminEditFunc extends Component {
    constructor(props) {
        super(props);

        this.state = {
            listDishes: [],
            select_dish_option: true,
            select_kitchen_option: false
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

    handleOnChangeOption(field, event) {
        var checked = event.target.checked;
        if (field == 'search_dish') {
            this.setState({ select_dish_option: checked, select_kitchen_option: !checked})
        } else {
            this.setState({ select_dish_option: !checked, select_kitchen_option: checked});
        }
    };

    render() {
        return (
            <div>
                <div className="row admin-select-show-option">
                    <div className="card z-depth-0" id="checkbox">
                        <input type="checkbox" className="dish_checkboxes filled-in"
                            id='dish_checkboxes' checked={this.state.select_dish_option} 
                            onChange={(event) => this.handleOnChangeOption('search_dish', event)}/>
                        <label htmlFor='dish_checkboxes'>Dish<div className="right icon"></div></label>
                    </div>

                    <div className="card z-depth-0" id="checkbox">
                        <input type="checkbox" className="kitchen_checkboxes filled-in"
                            id='kitchen_checkboxes' checked={this.state.select_kitchen_option} 
                            onChange={(event) => this.handleOnChangeOption('search_kitchen', event)}/>
                        <label htmlFor='kitchen_checkboxes'>Kitchen<div className="right icon"></div></label>
                    </div>
                </div>

                <div className='container'>
                    { (this.props.listDishes.length > 0 && this.props.listKitChens.length > 0) ?
                            (this.state.select_dish_option) ? 
                                <AdminListDish listDishes={this.props.listDishes} />
                            :
                                <AdminListKitchen listKitchens={this.props.listKitChens}/>
                        :
                            <BouncingLoader />
                    }
                </div>
            </div>
        );
    }
}

export default withTracker(props => {
    return {
        currentUser: Meteor.user(),
        listDishes: Dishes.find({deleted: false}).fetch(),
        listKitChens: Kitchen_details.find({}).fetch()
    };
})(AdminEditFunc);