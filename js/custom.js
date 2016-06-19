/* globals navigator, document, Reveal, window, alert */

var videoStream = null;

function attachVideo(element)
{
  'use strict';
  var video = document.querySelector(element);

  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({video: true})
        .then(function (stream) {
          if (videoStream) { videoStream.stop(); }
          video.src = window.URL.createObjectURL(stream);
          videoStream = stream.getVideoTracks()[0];
        }).catch(function (e) {
            alert(e);
        });
  }
}

Reveal.addEventListener('with-video', function() {
  'use strict';
  attachVideo('#videoElement');
}, false);

Reveal.addEventListener('slidechanged', function(e) {
   'use strict';
    if (e.previousSlide && e.previousSlide.hasAttribute('data-state') && e.previousSlide.getAttribute('data-state') === 'with-video')
    { // Switched off of a slide with video, turn off video
        if (videoStream) {
            videoStream.stop();
            videoStream = null;
        }
    }
});
