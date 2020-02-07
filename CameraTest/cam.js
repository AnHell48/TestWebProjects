var video = document.getElementById("video");
var canvas = document.getElementById('canvas');
var contxt = canvas.getContext("2d");
var image;
var dv = document.getElementById('devices');

//take pic
document.getElementById('snap').addEventListener("click", function()
{
  contxt.drawImage(video,0,0,640,480);
  //convert to image
  img = canvas.toDataURL("image/png");
});

document.getElementById("convert").addEventListener("click", function()
{
  document.write("<img src='"+img+"' />");
});
// have a overlay or a btn and when press it will ask for cam and turn it on
if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
{
  navigator.mediaDevices.getUserMedia({video:true}).then(function(stream)
  {
    
  getDevices();
    video.srcObject = stream;
    video.play();
  });
}


async function getDevices()
{
  var x;
  const devices = await navigator.mediaDevices.enumerateDevices();
  devices.forEach(function(device) {
    if(device.kind == "videoinput")
   x+= '--------'+ device.kind + ": " + device.label +
                " id = " + device.deviceId;
  });
  dv.innerHTML = x;
  console.log(devices);
}
