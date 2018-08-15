

export function show_loading_progress() {
    $('#showLoadFull').css('display', 'block');
};

export function hide_loading_progress() {
    $('#showLoadFull').css('display', 'none');
};

/**
 * Show popup confirm dialog
 * 
 * @param {*} title title of popup show
 * @param {*} content content of popup
 * @param {*} idAttr id attribute of btn oke submit
 */
export function open_dialog_confirm(title, content, callbackCancel, callbackSubmit) {
    $("p#confirm_title_message").text(title); // Set titile
    $("p#confirm_content_message").text(content); // Set content

    // Set id attribute when click submit
    // $("#confirm_message").find('a')[1].setAttribute('id', idAttr);
    
    $('#confirm_message').modal({
        dismissible: true, // Modal can be dismissed by clicking outside of the modal
        opacity: .5, // Opacity of modal background
        inDuration: 300, // Transition in duration
        outDuration: 200, // Transition out duration
        startingTop: '4%', // Starting top style attribute
        endingTop: '10%', // Ending top style attribute
    });
    $('#confirm_message').modal('open');

    // Cancel
    $('#cancel_modal_message').click( () => {
        callbackCancel();
    });

    // Oke submit
    $('#confirm_modal_message').click( () => {
        callbackSubmit();
    })
};