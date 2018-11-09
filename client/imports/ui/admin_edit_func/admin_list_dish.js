import React, { Component } from 'react';
import './admin_edit_func.css';
import AdminDishSelected from './admin_dish_selected.js';
import { open_dialog_delete_confirm } from '/imports/functions/common';


export default class AdminListDish extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listDishes: this.props.listDishes,
            dish_selected: {},
            selectedDish: false
        }
    };

    handleOnEditDish(index) {
        this.setState({dish_selected: this.state.listDishes[index], selectedDish: true}, () => {
            console.log(this.state.dish_selected)
        });
    };

    handleOnDeleteDish(dish_id) {
        open_dialog_delete_confirm("Are you sure?", "Are you sure to delete this menu?", () => {},() => {
            util.show_loading_progress();
            Meteor.call('dish.remove', dish_id, (err, res) => {
                if (!err) {
                    var new_listDishes = this.state.listDishes.filter( (item) => item._id != dish_id);
                    this.setState({ listDishes: new_listDishes});

                    Materialize.toast('Sucessed. ', 6000, 'rounded bp-green');
                    util.hide_loading_progress();
                } else {
                    Materialize.toast('Err ' + err.message, 6000, 'rounded bp-green');
                    util.hide_loading_progress();
                }
            });
        });
    }

    renderListDishes() {
        return (
            <table className="table table-striped table-hover table-bordered">
                <thead>
                    <tr>
                        <th className="dish-stt"></th>
                        <th className="dish-name-th">Dish name</th>
                        <th className="center">Cost</th>
                        <th className="center">Selling price</th>
                        <th className="center">Image</th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.listDishes.map((dish, index) => {
                       var dish_selling_price = parseFloat(dish.dish_selling_price/1.15).toFixed(2);
                        return (
                        <tr className="row" key={index}>
                            <td className="dish-stt">{index+1}</td>
                            <td className="dish-name-td">{dish.dish_name}</td>

                            <td className="center">{dish.dish_cost}</td>

                            <td className="center">{dish_selling_price}</td>

                            <td className="center admin-dish-img" style={{backgroundImage: `url(${dish.meta.origin})`}}>
                            </td>

                            <td className="center admin-edit-click" onClick={() => this.handleOnEditDish(index)}>
                                <span><i className="material-icons grey-text text-lighten-1">edit</i></span>
                            </td>

                            <td className="center admin-edit-click" onClick={() => this.handleOnDeleteDish(dish._id)}>
                                <span><i className="material-icons grey-text text-lighten-1">delete</i></span>
                            </td>
                        </tr>
                        );
                    })}
                </tbody>    
            </table>
        );
    };

    handleOnCancelEdit() {
        this.setState({selectedDish: false});
    };
    
    render() {
        return (
            <div id="admin-table-edit" className="table-responsive">
            { (!this.state.selectedDish) ? 
                this.renderListDishes()
            :
                <AdminDishSelected dish_selected={this.state.dish_selected} handleOnCancelEdit={() => this.handleOnCancelEdit()}/>
            }
            </div>
        );
    }
}