import React, { Component } from 'react';
import './button_footer.css';

export default class ButtonFooter extends Component {
    constructor(props) {
        super(props);

    }

    handleOnCancelEdit() {
        this.props.handleOnCancelEdit();
    };

    handleOnSubmit() {
        this.props.handleOnSubmit();
    }

    render() {
        return (
            <div id="admin-edit-footer" className="row text-right">
                <div id="admin-edit-cancel" onClick={() => this.handleOnCancelEdit()}>
                    <span>Cancel</span>             
                </div>

                <div id="admin-edit-submit" onClick={() => this.handleOnSubmit()}>
                    <span>Submit</span>             
                </div>
            </div>
        );
    }
}