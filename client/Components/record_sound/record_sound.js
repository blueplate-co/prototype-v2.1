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
        var blob = new Blob([result.audio], {type : 'audio/wav'});
        var url = URL.createObjectURL(blob);
        var srcElement = document.getElementsByTagName("source")[0];
        srcElement.src = url;
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

        var fileInfo = {
            name: file.name,
            type: file.type,
            size: file.size,
            file: null
        }

        reader.onload = function () {
            fileInfo.file = new Uint8Array(reader.result);
            callback(null, fileInfo);
        }
        reader.onerror = function () {
            callback(reader.error);
        }

        reader.readAsArrayBuffer(file);
    }
}
