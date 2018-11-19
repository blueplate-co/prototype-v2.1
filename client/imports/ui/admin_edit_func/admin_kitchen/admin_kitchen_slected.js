import React, { Component } from 'react';
import ButtonFooter from '../admin_common_component/button_footer/button_footer.js';
import districts from '/imports/functions/common/districts_common.json';

export default class AdminKitchenSelected extends Component {
    constructor(props) {
        super(props);

        this.state = {
            kitchenSelected: this.props.kitchenSelected,
            img_change: '',
            banner_change: '',
            fileObjBanner: null,
            fileObjProfileImage: null,
            kitchen_district: ''
        };
    }

    handleOnChangeField(field, event) {
        var oKitchen = this.state.kitchenSelected;
        oKitchen[field] = event.target.value;
        this.setState({ kitchenSelected:oKitchen });
    };

    handleOnchangeKitchenAddress(field, event) {
        // get address and geocode
        var oKitchen = this.state.kitchenSelected;

        oKitchen[field] = event.target.value;
        var kitchen_address = document.getElementById('kitchen_address');
        var autocomplete = new google.maps.places.Autocomplete(kitchen_address);
        google.maps.event.addListener(autocomplete, 'place_changed', function() {
            // $('#kitchen_address').removeClass('invalid');
            oKitchen.kitchen_address = autocomplete.getPlace().formatted_address;
            let kitchen_address_conversion = {
                lng: autocomplete.getPlace().geometry.location.lng(),
                lat: autocomplete.getPlace().geometry.location.lat()
            }
            oKitchen.kitchen_address_conversion = kitchen_address_conversion;
        });

        this.setState({ kitchenSelected: oKitchen });
    };

    handleOnChangeDistrict(event) {
        var kitchen_district = this.state.kitchen_district;
        kitchen_district = event.target.value;
        this.setState({ kitchen_district: kitchen_district});
    };

    renderKitchenImg(kitchen_detail) {
        var kitchen_banner_profile = '',
            kitchen_img = util.getDefaultChefImage();

        if (kitchen_detail.profileImg) {
            kitchen_img = kitchen_detail.profileImg.origin;
        }

        if (kitchen_detail.bannerProfileImg) {
            kitchen_banner_profile = kitchen_detail.bannerProfileImg.origin;
        }

        var image_upload = this.state.img_change ? this.state.img_change : kitchen_img,
            banner_upload = this.state.banner_change ? this.state.banner_change : kitchen_banner_profile;


        return (
            <div className='admin-kitchen-profile-img'>
                <div id='admin-kitchen-banner' style={{backgroundImage: `url(${banner_upload})`}}>
                    <div className="admin-banner-overlap" onClick={(event) => $('#admin-banner-change').trigger('click')}>
                        <input type='file' id='admin-banner-change' hidden onChange={(event)=>this.handleChangeImage('banner', event)} />
                        <p id="admin-banner-text">update profile banner</p>
                    </div>
                    <div id="admin-kitchen-image-selected" style={{backgroundImage: `url(${image_upload})`}}
                        onClick={(event)=> $('#admin-image-change').trigger('click')}
                    >
                        <input type='file' id='admin-image-change' hidden onChange={(event)=>this.handleChangeImage('image', event)}/>
                        <p id="admin-image-text">update profile image</p>
                    </div>
                </div>
            </div>
        );
    };

    renderKitchenTitle(kitchen_detail) {
        return (
            <div className='kitchen-title'>
                <div className='col s12 m3 l2'>
                    <h6>Kitchen title</h6>
                </div>

                <div className='col input-field s12 m5 l6'>
                    <input type="text" className="form_field" id='kitchen_name' value={kitchen_detail.kitchen_name}
                        onChange={(event) => this.handleOnChangeField('kitchen_name', event)}
                    />
                    <label className='active' htmlFor='kitchen_name'>Kitchen name</label>
                </div>

                <div className='col input-field s12 m4 l4'>
                    <input type="text" className="form_field" id='chef_name' value={kitchen_detail.chef_name}
                        onChange={(event) => this.handleOnChangeField('chef_name', event)}
                    />
                    <label className='active' htmlFor='chef_name'>Chef name</label>
                </div>
            </div>
        );
    };

    renderKitchenLocation(kitchen_detail) {

        return (
            <div className='kitchen-location'>
                <div className='col s12 m3 l2'>
                    <h6>Kitchen location <sup>*</sup></h6>
                </div>

                <div className='col s12 m9 l9'>
                    <div className='col input-field s12 m12 l12'>
                        <input type="text" className="form_field" id='kitchen_address' value={kitchen_detail.kitchen_address}
                            onChange={(event) => this.handleOnchangeKitchenAddress('kitchen_address', event)}
                        />
                        <label className='active' htmlFor='kitchen_address'>Kitchen address</label>
                    </div>
                    <div className='row'>
                        <div className='col input-field s6 m6 l6'>
                            <input type="text" className="form_field" id='kitchen_address_country' value={kitchen_detail.kitchen_address_country}
                                onChange={(event) => this.handleOnChangeField('kitchen_address_country', event)}
                            />
                            <label className='active' htmlFor='kitchen_address_country'>Country</label>
                        </div>

                        <div className="col input-field s6 m6 l6" id="district-option">
                            <select ref="dropdown" className="browser-default" id="kitchen_district" value={this.state.kitchen_district} 
                                defaultValue={this.state.kitchen_district} onChange={(event) => this.handleOnChangeDistrict(event)}>
                                <option value="" disabled>Choose a district</option>
                                {
                                    districts.map((item, index) => {
                                        return (
                                                <option key={index} value={item.districtName}>{item.districtName}</option>
                                            )
                                        })
                                }
                            </select>
                        </div>
                    </div>

                </div>
            </div>
        );
    };

    checkExistItemServicingOption(itemNeedCheck) {
        var listItem = ['Delivery', 'Dine-in', 'Pick-up'];
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

    handleOnChangeService(field, event) {
        var checked = event.target.checked,
            kitchen_selected = this.state.kitchenSelected;

        if (checked) {
            kitchen_selected.serving_option.push(field.service);
        } else {
            var arr_service = kitchen_selected.serving_option.filter( (item) => item != field.service);
            kitchen_selected.serving_option = arr_service;
        }
        this.setState({ dish_selected: kitchen_selected});
    };

    renderServingOption(kitchen_detail) {
        var serving_option_checked = this.checkExistItemServicingOption(kitchen_detail.serving_option);

        return (
            serving_option_checked.map( (item, idx) => {
                let service = item.itemName;
                return (
                    <div className="col s4 m4 l4 card z-depth-0" id="checkbox" key={idx}>
                        <input type="checkbox" className="serving_option_checkboxes filled-in form_field" id={"create_"+item.itemName} value={item.itemName}
                            defaultChecked={item.checked}
                            onChange={(event) => this.handleOnChangeService({service}, event)}
                        />
                        <label htmlFor={'create_' + item.itemName}>{item.itemName}<div className={"right icon icon_"+item.itemName}></div></label>
                    </div>
                );
            })
        );
    };

    handleChangeImage(field, event) {
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
                    if (field == 'banner') {
                        that.setState({ fileObjBanner: null})
                    } else {
                        that.setState({ fileObjProfileImage: null})
                    }
                    util.hide_loading_progress();
                } else {
                    if (field == 'banner') {
                        that.setState({ banner_change: reader.result, fileObjBanner: fileObj});
                    } else {
                        that.setState({ img_change: reader.result, fileObjProfileImage: fileObj});
                    }
                    util.hide_loading_progress();
                }
            });
            upload.start();
        }

        if (file) {
            reader.readAsDataURL(file); //reads the data as a URL
        } else {
            if (field == 'banner') {
                that.setState({ banner_change: ''});
            } else {
                that.setState({ img_change: ''});
            }
        }
    }

    componentDidMount() {
        $('#kitchen_contact').intlTelInput({
            initialCountry: "HK",
            utilsScript: "../intlTelInput/utils.js"
        });

        Meteor.call('user.getDistrict', this.state.kitchenSelected.user_id, (err, res) => {
            if (!err) {
               this.setState({ kitchen_district: res});
            }
        });

        Meteor.call('tag_autocomplete.get', (err, data) => {
            var autocompleteOptions = {data}
            autocompleteOptions.limit = 5;
            autocompleteOptions.minLength = 1;
            $('#kitchen_tags').material_chip({
              data: this.state.kitchenSelected.kitchen_tags,
              autocompleteOptions: autocompleteOptions
            });

            $('#kitchen_speciality').material_chip({
                data: this.state.kitchenSelected.kitchen_speciality,
                autocompleteOptions: autocompleteOptions
            });
        })
    };

    handleOnCancelEdit() {
        this.props.handleOnCancelSelect();
    };

    handleOnSubmit() {
        util.show_loading_progress();
        var kitchen = this.state.kitchenSelected,
            kitchen_speciality = $('#kitchen_speciality').material_chip('data'),
            kitchen_tags = $('#kitchen_tags').material_chip('data');
            
        kitchen.kitchen_speciality = kitchen_speciality;
        kitchen.kitchen_tags = kitchen_tags;

        if (this.state.fileObjProfileImage) {
            this.uploadImage('profile_image', kitchen, this.state.fileObjProfileImage.path, this.state.fileObjProfileImage._id);
        }

        if (this.state.fileObjBanner) {
            this.uploadImage('banner_image', kitchen, this.state.fileObjBanner.path, this.state.fileObjBanner._id);
        }

        Meteor.call('admin.update_kitchen', kitchen, (err, res) => {
            if (err) {
                Materialize.toast(err.message, 10000, 'rounded bp-green');
                util.hide_loading_progress();
            } else {
                Meteor.call('user.updateDistrict', kitchen.user_id, this.state.kitchen_district, (err, res) => {
                    if (err) {
                        Materialize.toast(err.message, 10000, 'rounded bp-green');
                        util.hide_loading_progress();
                    } else {
                        Materialize.toast('Update successed', 10000, 'rounded bp-green');
                        this.props.handleOnCancelSelect();
                        util.hide_loading_progress();
                    }
                });
            }
        });
    };

    /**
     * Upload image for kitchen
     * 
     * @param {*} type_img
     * @param {*} kitchen_obj 
     * @param {*} path_image 
     * @param {*} image_id 
     */
    uploadImage(type_img, kitchen_obj, path_image, image_id) {
        var new_img_name = this.changeImgName(path_image);
        Meteor.call('saveToKraken', new_img_name, path_image, (error, res) => {
            if(error) {
                console.log('kraken errors', error);
            } else {
                Meteor.call('admin.remove_image', image_id, (err, res) => {
                    if (!err) {
                        console.log('remove success');
                    }
                });
            }
        });

        //- declare some sizes
        var meta_img = {
            'origin': 'https://blueplate-images.s3.ap-southeast-1.amazonaws.com/images/original/' + new_img_name,
            'large': 'https://blueplate-images.s3.ap-southeast-1.amazonaws.com/images/large/' + new_img_name,
            'medium': 'https://blueplate-images.s3.ap-southeast-1.amazonaws.com/images/medium/' + new_img_name,
            'small': 'https://blueplate-images.s3.ap-southeast-1.amazonaws.com/images/small/' + new_img_name
        }

        if (type_img == 'profile_image') {
            kitchen_obj.profileImg = meta_img;
        } else if (type_img = 'banner_image') {
            kitchen_obj.bannerProfileImg = meta_img;
        }
    };

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
    };

    render() {
        var kitchen_detail = this.state.kitchenSelected;

        return (
            <div className="">
               <div className='row'>
                    {this.renderKitchenImg(kitchen_detail)}
               </div>

                <div className='row'>
                    {this.renderKitchenTitle(kitchen_detail)}
                </div>

                <div className='row'>
                    {this.renderKitchenLocation(kitchen_detail)}
                </div>

                <div className='row'>
                    <div className='col s16 m3 l2'>
                        <h6>Mobile phone number</h6>
                    </div>
                    <div className='col input-field s6 m6 l6'>
                        <input type="text" className="form_field" id='kitchen_contact' value={kitchen_detail.kitchen_contact}
                            onChange={(event) => this.handleOnChangeField('kitchen_contact', event)}
                        />
                        <label className='active' htmlFor='kitchen_contact'>Kitchen phone number</label>
                    </div>
                </div>

                <div className='row'>
                     <div className='col s16 m3 l2'>
                        <h6>Serving Options <sup>*</sup></h6>
                    </div>
                    <div className='col input-field s12 m9 l10'>
                        {this.renderServingOption(kitchen_detail)}
                    </div>
                </div>

                <div className='row'>
                    <div className='col s16 m3 l2'>
                        <h6>House rules</h6>
                    </div>
                    <div className='col input-field s12 m9 l10'>
                        <textarea placeholder="Any rules that you'd like your guests" id="house_rule" className="form_field materialize-textarea" 
                            type="text" onChange={(event) => this.handleOnChangeField('house_rule', event)}
                            value={kitchen_detail.house_rule} />
                    </div>
                </div>

                <div className='row'>
                    <h6>Cooking journey</h6>
                    <span>Share with us and the community about your journey of cooking. Writing an interesting story 
                        can help differentiating yourself from others in this marketing palce and attracting more attention from foodies.
                         It is optional, so don't worry if you want to come back to this later.</span>
                </div>

                <div className='row'>
                    <div className='col s12 m3 l2'>
                        <h6>Cooking experience</h6>
                    </div>
                    <div className='col input-field s12 m9 l10'>
                        <textarea placeholder="" id="cooking_exp" className="form_field materialize-textarea" 
                            type="text" onChange={(event) => this.handleOnChangeField('cooking_exp', event)}
                            value={kitchen_detail.cooking_exp} />
                    </div>
                </div>

                <div className='row'>
                    <div className='col s12 m3 l2'>
                        <h6>Cooking story</h6>
                    </div>
                    <div className='col input-field s12 m9 l10'>
                        <textarea placeholder="" id="cooking_story" className="form_field materialize-textarea" 
                            type="text" onChange={(event) => this.handleOnChangeField('cooking_story', event)}
                            value={kitchen_detail.cooking_story} />
                    </div>
                </div>

                <div className='row'>
                    <h6>Kitchen characteristics</h6>
                    <span>Type in a keyword and press 'enter' to create a tag. 
                        Our search engine uses these tags to shortlist and filter results.</span>
                </div>

                <div className='row'>
                    <div className="col s12 m3 l2">
                        <h6>Specialities</h6>
                    </div>
                    <div className="col s12 m9 l10">
                        <div className="chips" id="kitchen_speciality"></div>
                    </div>
                </div>
               
                <div className='row'>
                    <div className="col s12 m3 l2">
                        <h6>About your place and kitchen</h6>
                    </div>
                    <div className="col s12 m9 l10">
                        <div className="chips" id="kitchen_tags"></div>
                    </div>
                </div>

                <ButtonFooter 
                    handleOnCancelEdit={()=>this.handleOnCancelEdit()}
                    handleOnSubmit={()=>this.handleOnSubmit()}
                />
            </div>
        );
    }
}
