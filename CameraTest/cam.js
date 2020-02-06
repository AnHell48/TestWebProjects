var video = document.getElementById("video");
var canvas = document.getElementById('canvas');
var contxt = canvas.getContext("2d");

//take pic
document.getElementById('snap').addEventListener("click", function()
{

  contxt.drawImage(video,0,0,640,480);
});

document.getElementById("convert").addEventListener("click", function()
{

  var img = new Image();
  img.src = canvas.toDataURL("image/png");
  // canvas.width = img.width/2;
  // canvas.height = img.height/2;
  // contxt.drawImage(img,0,0,640,480);
  document.write("<img src='"+img+"' />");
});
// have a overlay or a btn and when press it will ask for cam and turn it on
if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
{
  navigator.mediaDevices.getUserMedia({video:true}).then(function(stream)
  {
    video.srcObject = stream;
    video.play();
  });
}
