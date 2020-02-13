"use strict"
//window.addEventListener("load", function(){

  var video = document.getElementById("video");
  var pauseRec = document.getElementById("pause-rec");
  var startRec = document.getElementById("start-rec");
  var camOverlay = document.getElementById("cam-overlay");
  var hiddenCanvas = document.getElementById('hidden-canvas');
  var previewCanvas = document.getElementById('preview-canvas');
  var deleteMedia = document.getElementById("delete-media");
  var dv = document.getElementById('devices');
  var recorder, contxt, image, userCamStream;
  var isThereAVideo = false;
  var recordedData = [];
  var recordingTime = 11000;//150000; //2.5 minutes
  var camSettings = {
    video: true
    /*{
        width: {ideal:140},
        height: {ideal:280},
      }*/};

  // turn on cam.
  camOverlay.addEventListener("click", function()
  {
     AskUserPermission();
   });

  //take pic
  document.getElementById('takePhoto').addEventListener("click", TakeAPic);

  // start/stop recording.
  startRec.addEventListener("click",StartRecording);

  // pause video while recording.
  pauseRec.addEventListener("click",PauseVideo);

  // delete video
  deleteMedia.addEventListener("click", DeleteMedia);

// ************************************ DEV TEST ONLY

// this needs to upload / save to directory instead
 function DownloadVId()
 {
    var blob = new Blob(recordedData, {
      type: 'video/mp4'
    });
   var url = URL.createObjectURL(blob);
   var a = document.createElement('a');
   document.body.appendChild(a);
   a.style = 'display: none';
   a.href = url;
   a.download = 'test.mp4';
   a.click();
   window.URL.revokeObjectURL(url);
 }

 // show overlay with the pic taken.
 previewCanvas.addEventListener("click", function()
 {
   // testing only *************
   // need to change for a overlay img preview like
   // "open" img
   document.write("<img src='"+image+"' />");
 });
  //**********************************DEV TEST ENDS

   // ask user permission for the cam.
  function AskUserPermission()
  {
    if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
    {
      TurnOnCam();
    }
  }

  function TurnOnCam()
  {
    navigator.mediaDevices.getUserMedia(camSettings).then(function(stream)
    {
      userCamStream = stream;
      EnableMedia();

      // if the cam is on then remove the overlay
      camOverlay.className = "hide";

      recorder = new MediaRecorder(userCamStream);
      video.srcObject = userCamStream;
      video.play();
      // video.requestFullscreen();
      getDevices();
    });
  }

// ERROR: WHEN COMPLETE ALONE RECORDING IT BUG

  function HandleDataAvaible(event)
  {
    video.stop;
    recordedData = [];
    deleteMedia.disabled = false;
    pauseRec.disabled = true;
    startRec.className = "fas fa-video";
    if(event.data.size > 0 && isThereAVideo)
    {
      recordedData.push(event.data);
      console.log("saved!");
      VideoPreview();
      isThereAVideo = false;
      //*********************** TEST ONLY
      // need to show preview instead
      // DownloadVId();
    }
  }

  function TakeAPic()
  {
    //disable video so you can't record when taken.
    startRec.disabled = true;
    //can be deleted
    deleteMedia.disabled = false;

    hiddenCanvas.width = video.videoWidth;
    hiddenCanvas.height = video.videoHeight;
    video = document.getElementById("video");
    contxt = hiddenCanvas.getContext('2d');

    // render to hidden canvas to create the image
    contxt.drawImage(video,0,0,video.videoWidth,video.videoHeight);
    //convert to image
    image = hiddenCanvas.toDataURL("image/png");

    //show preview image.
    contxt = previewCanvas.getContext("2d");
    contxt.drawImage(video,0,0,previewCanvas.width,previewCanvas.height);
  }

  function StartRecording()
  {
    //disable photo btn so user can't take a pic when recording
    takePhoto.disabled = true;
    //enable pause, recording can be paused
    pauseRec.disabled = false;

    recorder.ondataavailable  = HandleDataAvaible;

    if(startRec.className === "fas fa-video")
    {
      recorder.start(recordingTime);
      video.controls = true;
      startRec.className = "far fa-stop-circle";
      startRec.title = "Stop Recoding";
      isThereAVideo = true;
    }
    else if(startRec.className === "far fa-stop-circle")
    {
        recorder.stop();
        startRec.className = "fas fa-video";
        startRec.title = "Start Recoding";
    }
    console.log(video.currentTime);
  }

  function PauseVideo()
  {
    if (pauseRec.className === "far fa-pause-circle")
    {
      recorder.pause();
      pauseRec.className ="far fa-play-circle";
      pauseRec.title = "Continue Recoding";
    }
    else if (pauseRec.className === "far fa-play-circle"){
      recorder.resume();
      pauseRec.className = "far fa-pause-circle";
      pauseRec.title = "Pause Recoding";
    }
  }

  function DeleteMedia()
  {
    var media = "video";

    if(image != "")
    {
      media = "photo";
    }

    if(confirm("Delete "+media+"?"))
    {
      //delete video file
      recordedData = [];

      // delete photo
      if(media === "photo")
      {
        image = "";
        contxt.clearRect(0,0,hiddenCanvas.width,hiddenCanvas.height);
      }

      //change source to user camera
      video.src = null;
      video.srcObject = userCamStream;
      video.controls = false;
      video.play();
      startRec.disabled = false;

      EnableMedia();
    }
  }

  function VideoPreview()
  {
    // document.write("<video id='vd' autoplay></video>");
    // var vd = document.getElementById('vd');

    // disable the record btn so we can't take another
    startRec.disabled = true;

    var buffer = new Blob(recordedData, {type:"video/mp4"});
    console.log(buffer);
    video.srcObject = null;
    console.log(window.URL.createObjectURL(buffer));
    video.src = window.URL.createObjectURL(buffer);
    video.controls = true;
    video.play();
  }

  // getDevices();
  // search how many input devices(cameras) are there.
  async function getDevices()
  {
    var x;
    const devices = await navigator.mediaDevices.enumerateDevices();
    devices.forEach(function(device)
    {
      if (device.kind == "videoinput")
     x+= '--------'+ device.kind + "  label: " + device.label;
    });
    // ************************************* TEST DEV
    dv.innerHTML = x;
    console.log(x);
  }

  //can take picture or video.
  function EnableMedia()
  {
    takePhoto.disabled = false;
    startRec.disabled = false;

    pauseRec.disabled = true;
    deleteMedia.disabled = true;
  }

//});
