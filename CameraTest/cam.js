window.addEventListener("load", function(){

  var video = document.getElementById("video");
  var pauseRec = document.getElementById("pauseRec");
  var startRec = document.getElementById("startRec");
  var recorder;
  var canvas = document.getElementById('canvas');
  var contxt ;//= canvas.getContext("2d");
  var image;
  var recordedData = [];
  var dv = document.getElementById('devices');
  var camSettings = {
    video: true
    /*{
      width: {ideal:140},
      height: {ideal:280},
    }*/};

  AskUserPermission();

  //take pic
  document.getElementById('snap').addEventListener("click", function()
  {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    video = document.getElementById("video");
    contxt = canvas.getContext('2d');

    contxt.drawImage(video,0,0,video.videoWidth,video.videoHeight);
    //convert to image
    img = canvas.toDataURL("image/png");
    console.log(img);
    console.log(video);
  });


  pauseRec.addEventListener("click",function(){
    if (pauseRec.className === "far fa-pause-circle")
    {
      recorder.pause();
      pauseRec.className ="far fa-play-circle";
    }
    else if (pauseRec.className === "far fa-play-circle"){
      recorder.resume();
      pauseRec.className = "far fa-pause-circle";
    }
  });

  startRec.addEventListener("click",VideoRecorder);

// ************************************ DEV TEST ONLY


 function DownloadVId()
 {
    var blob = new Blob(recordedData, {
      type: 'video/webm'
    });
   var url = URL.createObjectURL(blob);
   var a = document.createElement('a');
   document.body.appendChild(a);
   a.style = 'display: none';
   a.href = url;
   a.download = 'test.webm';
   a.click();
   window.URL.revokeObjectURL(url);
 }

  document.getElementById("convert").addEventListener("click", function()
  {
    document.write("<img src='"+img+"' />");
  });
  //**********************************DEV TEST ENDS


  //******* have a overlay or a btn and when press it will ask for cam and turn it on
  // ask user permission for the cam.
  function AskUserPermission()
  {
    if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
    {
      TurnOnCam();
      // StartRecording();
    }
  }

  function TurnOnCam()
  {
    navigator.mediaDevices.getUserMedia(camSettings).then(function(stream)
    {
      var opts = {mineType:'video/webm; codecs=vp9'};
      recorder = new MediaRecorder(stream);
      video.srcObject = stream;
      video.play();

        // recorder.ondataavailable  = HandleDataAvaible;
        // recorder.start();
        console.log("end");
    });
  }

  function VideoRecorder()
  {
    recorder.ondataavailable  = HandleDataAvaible;
    if(startRec.className === "far fa-play-circle")
    {
      recorder.start();
      startRec.className = "far fa-stop-circle";
    }
    else if(startRec.className === "far fa-stop-circle")
    {
        recorder.stop();
        startRec.className = "far fa-play-circle";
    }
  }

// *********** IT'S WORKING !!!!!!!!!!!!!!!!!!!!!
  function HandleDataAvaible(event)
  {
    recordedData = [];
    console.log("here");
    if(event.data.size > 0)
    {
      recordedData.push(event.data);
      console.log(recordedData);
      // VideoPreview();

      //*********************** TEST ONLY
      DownloadVId();
    }
    else {
      console.log("... what???");
    }
  }

  function VideoPreview()
  {
    document.write("<video id='vd' autoplay></video>");
    var vd = document.getElementById('vd');
    vd.src = window.URL.createObjectURL(recordedData);
    vd.play();
  }

  getDevices();
  // search how many input devices(cameras) are there.
  async function getDevices()
  {
    var x;
    const devices = await navigator.mediaDevices.enumerateDevices();
    devices.forEach(function(device) {
      if (device.kind == "videoinput")
     x+= '--------'+ device.kind + ": " + device.label +
                  " id = " + device.deviceId;
    });
    dv.innerHTML = x;
    console.log(devices);
  }

});
