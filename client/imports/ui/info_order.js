import React, { Component } from 'react';
import { open_dialog_edit_confirm } from '/imports/functions/common';


export default class InfoOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            order_obj: this.props.order_obj
        }
    };

    handleOnChange(field, ev) {
        var order_info = this.state.order_obj;

        if (field === 'address_ordering') { // get address and geocode
            // Clear value before get new geocode
            order_info.address_conversion.lng = '';
            order_info.address_conversion.lat = '';

            var address_ordering = document.getElementById('address_ordering');
            var autocomplete = new google.maps.places.Autocomplete(address_ordering);
            google.maps.event.addListener(autocomplete, 'place_changed', function() {
                $('#address_ordering').removeClass('invalid');
                order_info.address_ordering = autocomplete.getPlace().formatted_address;
                order_info.address_conversion.lng = autocomplete.getPlace().geometry.location.lng();
                order_info.address_conversion.lat = autocomplete.getPlace().geometry.location.lat();
                console.log(order_info);
            });
        }
        order_info[field] = ev.target.value;

        var phone_formated = $('#phone_ordering').intlTelInput("getNumber");
        order_info['phone_ordering'] = phone_formated;
        this.setState({ order_obj:order_info});
    };

    scrollToFieldRequired(el, styleSheet) {
        var $el = $('#' + el);
        $el.addClass(styleSheet);
        $('#ordering-popup').animate({
          scrollTo: $el.offset().top
        }, 500);
        $el.focus();
    };

    handleOnCloseOrderInfo() {
        var hasChangeField = $('.dirty_field'),
        bChangeField = hasChangeField.length > 0;

        if (bChangeField) {
            open_dialog_edit_confirm("Are you sure?", "Some change field not save, are you sure exit?", () => {
              // Cancel
      
            }, () => {
                $('#ordering-popup').removeClass('.dirty_field');
                $('#ordering-popup').modal('close');
            });
        } else {
            $('#ordering-popup').modal('close');
        }
    }

    handleOnSaveOrderingInfo() {
        var ordering_info = this.state.order_obj;
        if (!this.validateInforOrdering(ordering_info)) {
            return;
        }

        $('#ordering-popup').removeClass('.dirty_field');
        $('#ordering-popup').modal('close');

        Meteor.call('ordering.syncProfileAndKitchen', ordering_info, (err, res) => {
            if (!err) {
                console.log('Create info success');
            }
        });
        console.log(this.state.order_obj);
    };

    validateInforOrdering(ordering_info) {
        if (ordering_info.name_ordering == '') {
            this.scrollToFieldRequired('name_ordering', 'invalid');
            Materialize.toast('Name is required.', 4000, 'rounded bp-green');
            return false;
        } else if (ordering_info.address_ordering == '') {
            this.scrollToFieldRequired('address_ordering', 'invalid');
            Materialize.toast('Address is required.', 4000, 'rounded bp-green');
            return false;
        } else if ( ordering_info.address_conversion.lng == '' || ordering_info.address_conversion.lat == '' ) {
            this.scrollToFieldRequired('address_ordering', 'invalid');
            Materialize.toast('Please select correct address!', 4000, 'rounded bp-green');
            return false;
        } else if (!$('#phone_ordering').intlTelInput("isValidNumber")) {
            this.scrollToFieldRequired('phone_ordering', 'invalid');
            Materialize.toast('Mobile number is not valid format.', 4000, 'rounded bp-green');
            return false;
        }
        return true;
    };

    render() {
        return (
            <div id="ordering-popup" className="modal modal-fixed-footer">
                <div className="modal-content">
                    <h5>Please fill your info before order</h5>
                    <div className="input-field col s6">
                        <input id="name_ordering" type="text" className="form_field" value={this.state.order_obj.name_ordering} onChange={this.handleOnChange.bind(this, 'name_ordering')}/>
                        <label className="active" htmlFor="name_ordering">name</label>
                    </div>
                    <div className="input-field col s6">
                        <input id="address_ordering" type="text" className="form_field" value={this.state.order_obj.address_ordering || ''} onChange={this.handleOnChange.bind(this, 'address_ordering')}/>
                        <label className="active" htmlFor="address_ordering">address</label>
                    </div>
                    <div className="input-field col s6">
                        <input id="phone_ordering" type="text" className="form_field" value={this.state.order_obj.phone_ordering} onChange={this.handleOnChange.bind(this, 'phone_ordering')}/>
                        <label className="active" htmlFor="phone_ordering">phone number</label>
                    </div>
                </div>
                <div className="modal-footer">
                    <a href="#!" className="waves-effect waves-green btn-flat btn-info-ordering-close" onClick={() => this.handleOnCloseOrderInfo()}>close</a>
                    <a href="#!" className="waves-effect waves-green btn-flat btn-info-ordering-confirm" onClick={() => this.handleOnSaveOrderingInfo()}>save</a>
                </div>
            </div> 
        );
    }

}