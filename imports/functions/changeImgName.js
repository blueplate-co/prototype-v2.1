export function changeImgName (imgPath) {

    //- return new name DateTime in milliseconds + unique ID
    let currentDate = new Date()
    var milliseconds = currentDate.getMilliseconds()
    //- uniqid
    let uniqid = require('uniqid');

    //- get extension from img path
    let fileExtension = require('file-extension')
    let extension = fileExtension(imgPath)
    console.log('file extension', extension)

    return milliseconds + '_' + uniqid()+ '.' + extension
    
}
