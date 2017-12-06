import { Meteor } from 'meteor/meteor';
var audio_context;
var recorder;

// generate log displayed on log frame
function __log(e, data) {
    log.innerHTML += "\n" + e + " " + (data || '');
}

if (navigator.getUserMedia) {
  audio_context = new AudioContext;
  navigator.getUserMedia({audio: true}, startUserMedia, function(e) {
    __log('No live audio input: ' + e);
  });
} else {
  __log("Your browser is not support this feature");
}


// init audio context
function startUserMedia(stream) {
  var input = audio_context.createMediaStreamSource(stream);
  __log('Media stream created.');
  // Uncomment if you want the audio to feedback directly
  //input.connect(audio_context.destination);
  //__log('Input connected to audio context destination.');

  recorder = new Recorder(input);
  __log('Recorder initialised.');
}

Template.record_sound.events({
  // when click start record
  'click #startRecording': function(event) {
      button = event.target;
      recorder && recorder.record();
      button.disabled = true;
      button.nextElementSibling.disabled = false;
      __log('Recording...');
  },
  //when click stop record
  'click #stopRecording': function(event) {
      button = event.target;
      recorder && recorder.stop();
      button.disabled = true;
      button.previousElementSibling.disabled = false;
      __log('Stopped recording.');

      // create WAV download link using audio data blob
      createDownloadLink();
  },
  //when click play recorder
  'click #play': function(event) {
      button = event.target;
      var result = UserAudios.findOne({ user_id: Meteor.userId() });
      if (result) {
        var blob = base64toBlob(result.audio, 'audio/wav');
        var url = URL.createObjectURL(blob);
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
        recordingslist.appendChild(li);
      } else {
        console.log('Cannot find audio files');
      }
  },
});

function createDownloadLink() {
  recorder && recorder.exportWAV(function(blob) {
      // var url = URL.createObjectURL(blob);
      // var li = document.createElement('li');
      // var au = document.createElement('audio');
      // var hf = document.createElement('a');
      //
      // au.controls = true;
      // au.src = url;
      // hf.href = url;
      // hf.download = new Date().toISOString() + '.wav';
      // hf.innerHTML = hf.download;
      // li.appendChild(au);
      // li.appendChild(hf);
      // recordingslist.appendChild(li);
      BinaryFileReader.read(blob, function (err, fileInfo) {
          Meteor.call('user_audio.insert', Meteor.userId() , Meteor.userId() + new Date().toISOString() + '.wav', fileInfo , Date.now());
      });
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
