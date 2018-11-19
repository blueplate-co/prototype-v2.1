import React, { Component } from 'react';
import './admin_edit_kitchen.css';
import AdminKitchenSelected from './admin_kitchen_slected.js';

export default class AdminListKitchen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            listKitChens: this.props.listKitchens ? this.props.listKitchens : [],
            oKitchenSelected: {},
            bSelectedKitchen: false
        };
    };

    // componentWillReceiveProps(nextProps) {
    //     this.setState({ listKitChens: nextProps.listKitChens ? nextProps.listKitChens : []});
    // };

    handleOnEditKitchen(index) {
        var oKitchenSelected = this.state.listKitChens[index];
        this.setState({ oKitchenSelected: oKitchenSelected, bSelectedKitchen: true });
    }

    renderListDishes() {
        return (
            <table className="table table-striped table-hover table-bordered">
                <thead>
                    <tr>
                        <th className="dish-stt"></th>
                        <th className="dish-name-th">Chef name</th>
                        <th className="center">Kitchen contact</th>
                        <th className="center">Kitchen address</th>
                        <th className="center">Image</th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.listKitChens.map((kitchenItem, index) => {
                        var kitchen_img = util.getDefaultChefImage();
                        if (kitchenItem.profileImg) {
                            kitchen_img = kitchenItem.profileImg.origin;
                        }
                        return (
                            <tr className="row" key={index}>
                                <td className="dish-stt">{index+1}</td>
                                <td className="kitchen-name-td">{kitchenItem.chef_name}</td>

                                <td className="center">{kitchenItem.kitchen_contact}</td>

                                <td className="admin-kitchen-address">{kitchenItem.kitchen_address}</td>
                                
                                <td className="center admin-kitchen-img" style={{backgroundImage: `url(${kitchen_img})`}}></td>

                                <td className="center admin-edit-click" onClick={() => this.handleOnEditKitchen(index)}>
                                    <span><i className="material-icons grey-text text-lighten-1">edit</i></span>
                                </td>

                                {/* <td className="center admin-edit-click" onClick={() => this.handleOnDeleteKitchen(kitchenItem._id)}>
                                    <span><i className="material-icons grey-text text-lighten-1">delete</i></span>
                                </td> */}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        );
    };

    handleOnCancelSelect() {
        $(window).scrollTop(0);
        this.setState({ bSelectedKitchen: false });
    };

    render() {

        return (
            <div id='admin-table-edit-kitchen' className="table-responsive">
                { (!this.state.bSelectedKitchen) ?
                    this.renderListDishes()
                :
                    <AdminKitchenSelected kitchenSelected={this.state.oKitchenSelected} 
                        handleOnCancelSelect={()=>this.handleOnCancelSelect()}
                    />
                }
            </div>
        );
    }
}