import { Meteor } from 'meteor/meteor';
var audio_context;
var recorder;

if (navigator.getUserMedia) {
  audio_context = new AudioContext;
  navigator.getUserMedia({audio: true}, startUserMedia, function(e) {
    console.log('No live audio input: ' + e);
  });
} else {
    console.log("Your browser is not support this feature");
}


// init audio context
function startUserMedia(stream) {
  var input = audio_context.createMediaStreamSource(stream);
  console.log('Media stream created.');
  // Uncomment if you want the audio to feedback directly
  //input.connect(audio_context.destination);
  //__log('Input connected to audio context destination.');

  recorder = new Recorder(input);
  console.log('Recorder initialised.');
}

Template.add_notes.onRendered( function(){
  $('#current_datetime').text(getCurrentDateTime());
});


Template.add_notes.events({
  //click to show panel recorder
  'click #audio_record': function(event) {

  },
  // when click start record
  'click #start-record': function(event) {
      button = event.target;
      recorder && recorder.record();
      // button.disabled = true;
      // button.nextElementSibling.disabled = false;
      $('#status_record').removeAttr('style');
      $('#start-record').hide();
      $('#stop-record').show();
  },
  //when click stop record
  'click #stop-record': function(event) {
      button = event.target;
      recorder && recorder.stop();
      console.log('Stopped recording.');
      $('#stop-record').hide();
      $('#play-record').show();
      $('#status_record span').text('Stopped');
      // create WAV download link using audio data blob
      createDownloadLink();
  },
  //when click play record
  'click #play-record': function(event) {
      button = event.target;
      $('#record').hide();
      $('#status_record').hide();
      $('.record_wrapper li audio')[0].play();
  },
  'click #save-record': function(event) {
      button = event.target;
      BinaryFileReader.read(window.blob, function (err, fileInfo) {
        Meteor.call('user_audio.insert', Meteor.userId() , Meteor.userId() + new Date().toISOString() + '.wav', fileInfo , Date.now(), function(error, result){
            if (error) {
                Materialize.toast('Error when saved!', 4000)
            } else {
                Materialize.toast('Audio has been saved!', 4000)
            }
        });
      });

  }
  //when click play recorder NO NEED NOW
  // 'click #play': function(event) {
  //     button = event.target;
  //     var result = UserAudios.findOne({ user_id: Meteor.userId() });
  //     if (result) {
  //       var blob = base64toBlob(result.audio, 'audio/wav');
  //       var url = URL.createObjectURL(blob);
  //       var li = document.createElement('li');
  //       var au = document.createElement('audio');
  //       var hf = document.createElement('a');
  //       au.controls = true;
  //       au.src = url;
  //       hf.href = url;
  //       hf.download = new Date().toISOString() + '.wav';
  //       hf.innerHTML = hf.download;
  //       li.appendChild(au);
  //       li.appendChild(hf);
  //     } else {
  //       console.log('Cannot find audio files');
  //     }
  // },
});

function createDownloadLink() {
  recorder && recorder.exportWAV(function(blob) {
      //create audio element
      var url = URL.createObjectURL(blob);
      window.blob = blob;
      var li = document.createElement('li');
      var au = document.createElement('audio');
      var hf = document.createElement('a');
      au.controls = true;
      au.src = url;
      hf.href = url;
      hf.download = new Date().toISOString() + '.wav';
      hf.innerHTML = hf.download;
      li.appendChild(au);
      li.appendChild(hf);
      $('.record_wrapper').prepend(li);
  });
};

var BinaryFileReader = {
    read: function (file, callback) {
        var reader = new FileReader;
        reader.readAsDataURL(file);

        var fileInfo = {
            name: file.name,
            type: file.type,
            size: file.size,
            file: null
        }

        reader.onloadend = function () {
            base64data = reader.result.split(',')[1]; // split to remove content/type of base64
            callback(null, base64data);
        }

        reader.onerror = function () {
            callback(reader.error);
        }
    }
}

function base64toBlob(base64Data, contentType) {
    contentType = contentType || '';
    var sliceSize = 1024;
    var byteCharacters = atob(base64Data);
    var bytesLength = byteCharacters.length;
    var slicesCount = Math.ceil(bytesLength / sliceSize);
    var byteArrays = new Array(slicesCount);

    for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
        var begin = sliceIndex * sliceSize;
        var end = Math.min(begin + sliceSize, bytesLength);

        var bytes = new Array(end - begin);
        for (var offset = begin, i = 0 ; offset < end; ++i, ++offset) {
            bytes[i] = byteCharacters[offset].charCodeAt(0);
        }
        byteArrays[sliceIndex] = new Uint8Array(bytes);
    }
    return new Blob(byteArrays, { type: contentType });
}

function getCurrentDateTime() {
    var result = "Current date time goes here";
    var d = new Date();
    result = d.getDate() + "/" + d.getMonth() + "/" + d.getFullYear() + " | " + d.getHours() + ":" + d.getMinutes();
    return result;
}

function updateTime() {
    console.log(this.duration);
    console.log(this.currentTime);
}
