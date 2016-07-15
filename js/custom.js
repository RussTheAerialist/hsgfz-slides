/* globals navigator, document, Reveal, window, alert, console, XMLHttpRequest */

var videoStream = null;
console.log('custom loaded');

function triggerState(url) {
    'use strict';

    var xmlHttp = new XMLHttpRequest();
    var promise = new Promise(function (resolve) {
        xmlHttp.onreadystatechange = function() {
            if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
                resolve(xmlHttp.responseText);
            }
        };
        xmlHttp.open('GET', url, true); // true for asynchronous
        xmlHttp.send(null);
    });

    return promise;
}

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

function slideIs(slide, attr, value) {
    'use strict';
    return slide && slide.hasAttribute(attr) && slide.getAttribute(attr) === value;
}

Reveal.addEventListener('with-video', function() {
  'use strict';
  attachVideo('#videoElement');
}, false);

Reveal.addEventListener('slidechanged', function(e) {
   'use strict';
    if (slideIs(e.previousSlide, 'data-state', 'with-video'))
    { // Switched off of a slide with video, turn off video
        if (videoStream) {
            videoStream.stop();
            videoStream = null;
        }
    }

    if (slideIs(e.currentSlide, 'data-state', 'device-trigger') && e.currentSlide.hasAttribute('data-trigger-url')) {
        var url = e.currentSlide.getAttribute('data-trigger-url');
        triggerState(url);
    }
});
