import React, { Component } from 'react';
import './admin_edit_func.css';
import { withTracker } from 'meteor/react-meteor-data';
import dishUnits from '/imports/functions/common/dish_unit.json';
import { open_dialog_edit_confirm } from '/imports/functions/common';
import ButtonFooter from './admin_common_component/button_footer/button_footer.js';

export class AdminDishSelected extends Component {
    constructor(props) {
        super(props);

        this.state={
            dish_selected: this.props.dish_selected || {},
            ingredients: [],
            img_change: '',
            fileObj: null
        }
    };

    componentWillReceiveProps(nextProps, nextState) {
        this.setState({ dish_selected: nextProps.dish_selected || {} });
    };

    handleOnCancelEdit() {
        var hasChangeField = $('.dirty_field'),
        bChangeField = hasChangeField.length > 0;

        if (bChangeField) {
            open_dialog_edit_confirm("Are you sure?", "Some change field not save, are you sure cancel?", () => {
                // Cancel

            }, () => {
                this.props.handleOnCancelEdit();
            });
        } else {
            this.props.handleOnCancelEdit();
        }
        
    };

    handleOnChangeService(field, event) {
        var checked = event.target.checked,
            dish_selected = this.state.dish_selected;

        if (checked) {
            dish_selected.serving_option.push(field.service);
        } else {
            var arr_service = dish_selected.serving_option.filter( (item) => item != field.service);
            dish_selected.serving_option = arr_service;
        }
        this.setState({ dish_selected: dish_selected});
    };

    checkExistItemService(itemNeedCheck, listItem) {
        var item_check = {},
            arr_items = [];

        itemNeedCheck.map( i => item_check[i] = true);

        listItem.map( item => {
            if (item_check[item]) {
                arr_items.push({"itemName": item, "checked": true});
            } else {
                arr_items.push({"itemName": item, "checked": false});
            }
        });

        return arr_items;
    }

    renderServingOption(user_id) {
        var kitchen = Kitchen_details.findOne({user_id: user_id});
        var dish_service = this.state.dish_selected.serving_option;

        
        if (kitchen) {
            var serving_option = kitchen.serving_option;
            var serving_option_checked = this.checkExistItemService(dish_service, serving_option);
            return (
                serving_option_checked.map( (item, idx) => {
                    let service = item.itemName;
                    return (
                        <div className="card z-depth-0" id="checkbox" key={idx}>
                            <input type="checkbox" className="serving_option_checkboxes filled-in form_field" id={"create_"+item.itemName} value={item.itemName}
                                defaultChecked={item.checked}
                                onChange={(event) => this.handleOnChangeService({service}, event)}
                            />
                            <label htmlFor={'create_' + item.itemName}>{item.itemName}<div className={"right icon icon_"+item.itemName}></div></label>
                        </div>
                    );
                })
            )
        } else {
            return <span>Empty serving option</span>
        }
    };

    componentDidMount() {
        $(window).scrollTop(0);
        $('.page-footer').hide();
        $('#top-navigation-container').hide();

        Meteor.call('admin.get_list_ingredient', this.state.dish_selected.dish_name, this.state.dish_selected.user_id, (err, res) => {
            if (!err) {
                this.setState({ ingredients: res});
            }
        });

        Meteor.call('tag_autocomplete.get', (err, data) => {
            var autocompleteOptions = {data}
            autocompleteOptions.limit = 5;
            autocompleteOptions.minLength = 1;
            $('#dish_tags').material_chip({
              data: this.state.dish_selected.dish_tags,
              autocompleteOptions: autocompleteOptions
            });
        })
    }

    renderIngredient(dish_name, user_id) {
        // var ingredients = Ingredients.find({ dish_name: dish_name, user_id: user_id}).fetch();

        return(
            this.state.ingredients.map( (ingredient, idx) => {
                return (
                    <div className="row" key={idx}>
                        <div className="col s3 m3 l3">
                            <input id="ingredient_name" value={ingredient.ingredient_name} className="form_field" 
                                onChange={(event) => this.handleOnChangeIngredient('ingredient_name', idx, event)}
                                name="ingredient_name" type="text"/>
                        </div>

                        <div className="col s3 m3 l3">
                            <input id="ingredient_quantity" value={ingredient.ingredient_quantity} className="form_field" 
                                onChange={(event) => this.handleOnChangeIngredient('ingredient_quantity', idx, event)}
                                name="ingredient_quantity" placeholder="0" type="number" min="0"/>
                        </div>

                        <div className="col s4 m4 l4">
                            <select ref="dropdown" className="browser-default" id="ingredient_unit"
                                onChange={(event) => this.handleOnChangeIngredient('ingredient_unit', idx, event)}>
                                <option  value={ingredient.ingredient_unit}>{ingredient.ingredient_unit}</option>
                                {
                                    dishUnits.ingredient_unit.map((item, index) => {
                                        return (
                                                <option key={index} value={item.shortform}>{item.name}</option>
                                            )
                                        })
                                }
                            </select>
                        </div>

                        <div className="col s2 m2 l2">
                            <span onClick={() => this.handleDeleteIngredient(ingredient, idx)}>
                                <i className="material-icons grey-text text-lighten-1 admin-edit-del-ingredient-btn">highlight_off</i>
                            </span>
                        </div>
                    </div>
                );
            })
        );
    };

    checkExistItemTagUnit(itemNeedCheck, listItem) {
        var item_check = {},
            arr_items = [];

        if (itemNeedCheck) {
            itemNeedCheck.map( i => item_check[i] = true);
    
            listItem.map( item => {
                if (item_check[item.name]) {
                    arr_items.push({"name": item.name, "checked": true, "file_name": item.file_name});
                } else {
                    arr_items.push({"name": item.name, "checked": false, "file_name": item.file_name});
                }
            });
    
            return arr_items;
        } else {
            return listItem;
        }
    }

    handleOnChangeAllergyTag(field, event) {
        var checked = event.target.checked,
            dish_selected = this.state.dish_selected;

        if (!dish_selected.allergy_tags) { // If null
            dish_selected.allergy_tags = [];
        }

        if (checked) {
            dish_selected.allergy_tags.push(field);
        } else {
            var arr_allergy_tags = dish_selected.allergy_tags.filter( (item) => item != field);
            dish_selected.allergy_tags = arr_allergy_tags;
        }
        this.setState({ dish_selected: dish_selected});
    };

    renderAllergyTags(allergy_tags) {
        var allergy_tags_checked = this.checkExistItemTagUnit(allergy_tags, dishUnits.allergy_list);
        return(
            allergy_tags_checked.map( (item, index) => {
                var field = item.name;
                return(
                    <div className="card z-depth-0" id="checkbox" key={index}>
                        <input type="checkbox" className="allergy_checkboxes filled-in form_field"
                         id={item.file_name} value={item.name} defaultChecked={item.checked} 
                         onChange={(event) => this.handleOnChangeAllergyTag(field, event)}/>
                        <label htmlFor={item.file_name}>{item.name}<div className={"right icon icon_" + item.file_name}></div></label>
                    </div>
                )
            })
        );
    };

    handleOnChangeDietaryTag(field, event) {
        var checked = event.target.checked,
            dish_selected = this.state.dish_selected;

        if (!dish_selected.dietary_tags) { // If null
            dish_selected.dietary_tags = [];
        }

        if (checked) {
            dish_selected.dietary_tags.push(field);
        } else {
            var arr_dietary_tags = dish_selected.dietary_tags.filter( (item) => item != field);
            dish_selected.dietary_tags = arr_dietary_tags;
        }
        this.setState({ dish_selected: dish_selected});
    };

    renderDietaryList(dietary_tags) {
        var dietary_tags_checked = this.checkExistItemTagUnit(dietary_tags, dishUnits.dietary_list);
        return(
            dietary_tags_checked.map( (item, index) => {
                var field = item.name;
                return(
                    <div className="card z-depth-0" id="checkbox" key={index}>
                        <input type="checkbox" className="filled-in form_field" id={item.file_name} value={item.name} 
                            defaultChecked={item.checked} onChange={ (event) => this.handleOnChangeDietaryTag(field, event)}/>
                        <label htmlFor={item.file_name}>{item.name}</label>
                    </div>
                )
            })
        );
    };

    handleOnChangeField(field, event) {
        var dish_editing = this.state.dish_selected;
        dish_editing[field] = event.target.value;

        if (field === 'dish_selling_price' || field === 'dish_cost') {
            dish_editing['dish_profit'] = dish_editing.dish_selling_price - dish_editing.dish_cost;
        }

        this.setState({ dish_selected: dish_editing});
    };

    submitIngredient() {
        var arr_ingredients = this.state.ingredients;

        arr_ingredients.map( (item, index) => {
            if (item.new_field) {
                Meteor.call('admin.insert_new_ingredient', item);
            } else if (item._id) {
                Meteor.call('admin.update_exist_ingredient', item);
            }
        });
    }

    checkUploadImage(dish) {
        var new_img_new = this.changeImgName(this.state.fileObj.path);
        Meteor.call('saveToKraken', new_img_new, this.state.fileObj.path, (error, res) => {
            if(error) {
                // console.log('kraken errors', error);
            } else {
                Meteor.call('admin.remove_image', this.state.fileObj._id, (err, res) => {
                    if (!err) {
                        // console.log('remove success');
                    }
                });
            }
        });

        //- declare some sizes
        var meta_img = {
            'origin': 'https://blueplate-images.s3.ap-southeast-1.amazonaws.com/images/original/' + new_img_new,
            'large': 'https://blueplate-images.s3.ap-southeast-1.amazonaws.com/images/large/' + new_img_new,
            'medium': 'https://blueplate-images.s3.ap-southeast-1.amazonaws.com/images/medium/' + new_img_new,
            'small': 'https://blueplate-images.s3.ap-southeast-1.amazonaws.com/images/small/' + new_img_new
        }

        dish.meta = meta_img;
    }

    handleOnSubmit() {
        util.show_loading_progress();
        var dish = this.state.dish_selected;
        var dish_tags = $('#dish_tags').material_chip('data');
        dish.dish_tags = dish_tags;
        this.submitIngredient();

        if (this.state.fileObj) {
            this.checkUploadImage(dish);
        }

        Meteor.call('admin.update_dish', dish, (err, res) => {
            if (!err) {
                Materialize.toast('Update dish success', 4000, 'rounded bp-green');
                util.hide_loading_progress();
                this.props.handleOnCancelEdit();
            } else {
                Materialize.toast(err.message, 4000, 'rounded bp-green');
                util.hide_loading_progress();
            }
        })
    };

    handleOnChangeIngredient(field, index, event) {
        var arr_ingredients = this.state.ingredients;

        arr_ingredients[index][field] = event.target.value;
        this.setState({ ingredients: arr_ingredients})
    };

    handleAddIngredient() {
        var new_ingredient_obj = {
            dish_name: this.state.dish_selected.dish_name,
            ingredient_name: '',
            ingredient_quantity: '',
            ingredient_unit: '',
            user_id: this.state.dish_selected.user_id,
            new_field: true
        };

        var arr_ingredients = this.state.ingredients;
        arr_ingredients.push(new_ingredient_obj);
        this.setState({ ingredients: arr_ingredients});
    };

    handleDeleteIngredient(ingredient, index) {
        util.show_loading_progress();
        var arr_ingredients = this.state.ingredients;
        arr_ingredients.splice(index, 1);
        if (ingredient.new_field) { // If is new ingredient
            util.hide_loading_progress();
            this.setState({ ingredients: arr_ingredients});
        } else if (ingredient._id) { // If exist ingredient
            Meteor.call('ingredient.remove', ingredient._id, (err, res) => {
                if (!err) {
                    this.setState({ ingredients: arr_ingredients});
                    util.hide_loading_progress();
                } else {
                    console.log(err);
                    util.hide_loading_progress();
                }
            });
        }
    };

    handleClickImage() {
        $('#admin-img-file').trigger('click');
    };

    handleChangeImage(event) {
        var that = this;
        // var file = document.querySelector('input[type=file]').files[0]; //sames as here
        var file = event.target.files[0];
        var reader  = new FileReader();

        reader.onloadend = function () {
            util.show_loading_progress();
            
            // Get path image
            upload = Images.insert({
                file: reader.result,
                isBase64: true,
                fileName: file.name,
                streams: 'dynamic',
                chunkSize: 'dynamic',
                meta: {
                    base64: reader.result
                }
            }, false);
            
            upload.on('start', function () {});
            upload.on('end', function (error, fileObj) {
                if (error) {
                    that.setState({ fileObj: null})
                    util.hide_loading_progress();
                } else {
                    that.setState({ img_change: reader.result, fileObj: fileObj});
                    util.hide_loading_progress();
                }
            });
            upload.start();
        }

        if (file) {
            reader.readAsDataURL(file); //reads the data as a URL
        } else {
            that.setState({ img_change: ''});
        }
    }

    changeImgName(imgPath) {
        //- return new name DateTime in milliseconds + unique ID
        let currentDate = new Date()
        var milliseconds = currentDate.getMilliseconds()
        //- uniqid
        let uniqid = require('uniqid');

        //- get extension from img path
        let fileExtension = require('file-extension')
        let extension = fileExtension(imgPath)

        return milliseconds + '_' + uniqid()+ '.' + extension
    }

    renderDishImage(dish_selected) {
        var img_change = this.state.img_change;
        var img_url = img_change != '' ? img_change : dish_selected.meta.origin;
        return (
            <div className="row admin-image-upload" style={{backgroundImage: 'url(' +img_url+')'}} onClick={()=>this.handleClickImage()}>
                <div id="admin-img-block">
                    <input type="file" id="admin-img-file" className="form_field" hidden onChange={(event)=>this.handleChangeImage(event)}/>
                </div>
                <div id="admin-image-hover-overlap">
                    <p id="admin-change-img-text">Change dish image</p>
                </div>
            </div>
        );
    };

    render() {
        var dish_selected = this.state.dish_selected;

        return(
            <div className="create_dishes_form_container container">
                <div className="dish_descriptions" id="dish_descriptions">
                    {this.renderDishImage(dish_selected)}
                    
                    <div className="row">
                        <div className="col l12 m12 s12">
                            <span>Not sure what to do? </span><a className="modal-close" href="/seller-handbook/articles/vEHhJS49AtipqyHWq">This article </a><span>should help.</span>
                        </div>
                    </div>
                    <p>Fields marked with * are compulsory</p>
                    <div className="row">
                        <div className="col l3 m12 s12 valign">
                            <h6>Dish descriptions</h6>
                        </div>
                        <div className="input-field col l9 m12 s12">
                            <input placeholder="Type your dish name *" name="dish_name" id="dish_name" type="text" className="form_field"
                             onChange={(event) => this.handleOnChangeField('dish_name', event)}
                             value={this.state.dish_selected.dish_name || ''} />
                        </div>
                    </div>

                    <div className ="row">
                        <div className="col l3 m12 s12"></div>
                        <div className="input-field col l9 m12 s12">
                            <textarea placeholder="Type something about your dish - description" id="dish_description" className="form_field materialize-textarea" 
                                type="text" onChange={(event) => this.handleOnChangeField('dish_description', event)}
                                value={this.state.dish_selected.dish_description || ''} />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col l3 m12 s12">
                            <h6>Serving options *</h6>
                        </div>
                        <div className="col l9 m12 s12 ">
                            {this.renderServingOption(dish_selected.user_id)}
                        </div>
                    </div>

                    <div className="row">
                        <div className="col l3 m12 s12">
                            <h6>Advanced order time</h6>
                        </div>

                        <div className="input-field col l9 m9 s9">
                            <div className="row">
                                {/* <!-- <i className="material-icons prefix">av_timer</i> --> */}
                                <div className="input-field no-margin col s4">
                                    <span>Days</span>
                                    <select id="days" name="days" className="browser-default form_field" onChange={(event) => this.handleOnChangeField('days', event)}
                                        defaultValue={this.state.dish_selected.days}
                                    >
                                        <option value="0" disabled>Choose your days</option>
                                        {Array.apply(0, Array(31)).map(function (x, i) {
                                            return <option key={i} value={i}>{i}</option>
                                        })}
                                    </select>
                                </div>
                                <div className="input-field no-margin col s4">
                                    <span>Hours</span>
                                    <select id="hours" name="hours" className="browser-default form_field"
                                         defaultValue={this.state.dish_selected.hours} onChange={(event) => this.handleOnChangeField('hours', event)}>
                                        <option value="0" disabled>Choose your hours</option>
                                        {Array.apply(0, Array(13)).map(function (x, i) {
                                            return <option key={i} value={i}>{i}</option>
                                        })}
                                    </select>
                                </div>

                                <div className="input-field no-margin col s4">
                                    <span>Mins</span>
                                    <select id="mins" name="mins" className="browser-default form_field"
                                        onChange={(event) => this.handleOnChangeField('mins', event)} defaultValue={this.state.dish_selected.mins}>
                                        <option value="0" disabled>Choose your mins</option>
                                        {Array.apply(0, Array(12)).map(function (x, i) {
                                            i *= 5;
                                            return <option key={i} value={i}>{i}</option>
                                        })}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row add_ingredient">
                        <h6>Ingredients</h6>
                        <br/>
                        <div className="row admin-edit-font-weight">
                            <div className="col s4 m4 l4">
                                  <span>Ingredient</span>        
                            </div>
                            <div className="col s4 m4 l4">
                                <span>Quantity</span>
                            </div>
                            <div className="col s4 m4 l4">
                                <span>Unit</span>
                            </div>
                        </div>
                        {this.renderIngredient(dish_selected.dish_name, dish_selected.user_id)}
                        <div className="row text-right">
                            <span onClick={() => this.handleAddIngredient()}> 
                                <i className="medium material-icons add-ingredient-btn">control_point</i>
                            </span>
                        </div>

                    </div>
                    
                    <div className="row add_price">
                        <h6>Price</h6>
                        <br/>
                        <div className="row admin-edit-font-weight">
                            <div className="col s4 m4 l4">
                                  <span>Cost</span>        
                            </div>
                            <div className="col s4 m4 l4">
                                <span>Selling price *</span>
                            </div>
                            <div className="col s4 m4 l4">
                                <span>Expected profit</span>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col s4 m4 l4">
                                <input id="dish_cost" defaultValue={dish_selected.dish_cost} className="form_field" 
                                    name="dish_cost" type="text" onChange={(event) => this.handleOnChangeField('dish_cost', event)}/>
                            </div>

                            <div className="col s4 m4 l4">
                                <input id="dish_selling_price" defaultValue={dish_selected.dish_selling_price} className="form_field" 
                                    name="dish_selling_price" placeholder="0" type="number" min="0"
                                    onChange={(event) => this.handleOnChangeField('dish_selling_price', event)}/>
                            </div>

                            <div className="col s4 m4 l4">
                                <input id="dish_profit" className="form_field" value={dish_selected.dish_profit}
                                    name="dish_profit" type="text" readOnly/>
                            </div>
                        </div>
                    </div>

                    <div className="row food_allergies">
                        <div className="col l3 m12 s12">
                            <h6>Major food allergies</h6>
                        </div>
                        <div className="col l9 m12 s12">
                            {this.renderAllergyTags(dish_selected.allergy_tags)}
                        </div>
                    </div>

                    <div className="row dietary_preferences">
                        <div className="col l3 m12 s12">
                            <h6>Dietary preferences</h6>
                        </div>
                        <div className="col l9 m12 s12">
                            {this.renderDietaryList(dish_selected.dietary_tags)}
                        </div>
                    </div>

                    <div className="row food_tags">
                        <div className="col l3 m12 s12">
                            <h6>Tags</h6>
                        </div>
                        <div className="col l9 m12 s12">
                            <p>Type in a keyword and press 'enter' to create a tag. Our search engine uses these tags to shortlist and filter results.</p>
                            <br/>
                            <div className="chips" id="dish_tags"></div>
                        </div>
                    </div>
                    
                    <ButtonFooter 
                        handleOnCancelEdit={()=>this.handleOnCancelEdit()}
                        handleOnSubmit={()=>this.handleOnSubmit()}
                    />
                </div>
            </div>
        );
    }
}

export default withTracker(props => {
    const handle = Meteor.subscribe('theIngredients');
    return {
        currentUser: Meteor.user(),
        listLoading: !handle.ready(),
    };
})(AdminDishSelected);