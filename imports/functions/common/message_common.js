
/**
 * Show popup confirm dialog
 * 
 * @param {*} title title of popup show
 * @param {*} content content of popup
 * @param {*} idAttr id attribute of btn oke submit
 */
export function open_dialog_edit_confirm(title, content, callbackCancel, callbackSubmit) {
    $("p#confirm_title_edit_message").text(title); // Set titile
    $("p#confirm_content_edit_message").text(content); // Set content

    $('#confirm_edit_message').modal({
        dismissible: true, // Modal can be dismissed by clicking outside of the modal
        opacity: .5, // Opacity of modal background
        inDuration: 300, // Transition in duration
        outDuration: 200, // Transition out duration
        startingTop: '4%', // Starting top style attribute
        endingTop: '10%', // Ending top style attribute
    });
    $('#confirm_edit_message').modal('open');

    // Cancel
    $('#cancel_modal_edit_message').click( () => {
        callbackCancel();
    });

    // Oke submit
    $('#confirm_modal_edit_message').click( () => {
        callbackSubmit();
    })
};

/**
 * Show popup confirm dialog
 * 
 * @param {*} title title of popup show
 * @param {*} content content of popup
 * @param {*} idAttr id attribute of btn oke submit
 */
export function open_dialog_delete_confirm(title, content, callbackCancel, callbackSubmit) {
    $("p#confirm_title_delete_message").text(title); // Set titile
    $("p#confirm_content_delete_message").text(content); // Set content

    $('#confirm_delete_message').modal({
        dismissible: true, // Modal can be dismissed by clicking outside of the modal
        opacity: .5, // Opacity of modal background
        inDuration: 300, // Transition in duration
        outDuration: 200, // Transition out duration
        startingTop: '4%', // Starting top style attribute
        endingTop: '10%', // Ending top style attribute
    });
    $('#confirm_delete_message').modal('open');

    // Cancel
    $('#cancel_modal_delete_message').click( () => {
        callbackCancel();
    });

    // Oke submit
    $('#confirm_modal_delete_message').click( () => {
        callbackSubmit();
    })
};