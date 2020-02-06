var video = document.getElementById("video");

if(navigator.mediaDevice && navigator.mediaDevice.getUserMedia)
{
  navigator.mediaDevice.getUserMedia({video:true}).then(function(stream)
  {
    video.srcObject = stream;
    video.play();
  });
}

alert("hello");
