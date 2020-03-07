"use strict"
//window.addEventListener("load", function(){

var video = document.getElementById("video");
var pauseRec = document.getElementById("pause-rec");
var startRec = document.getElementById("start-rec");
var camOverlay = document.getElementById("cam-overlay");
var hiddenCanvas = document.getElementById('hidden-canvas');
var previewCanvas = document.getElementById('previewImg');
var deleteMedia = document.getElementById("delete-media");
var recordTime = document.getElementById("recording-time");
var img_prevw = document.getElementById("img-prev");
var changeCam = document.getElementById("change-cam-btn");
//var dv = document.getElementById('devices');
var recorder, contxt, image, imgPrev, userCamStream, startTime, mediaType, mediaBlob;
var isThereAVideo = false;
var isThereAPhoto = false;
var videoFile = false;
var timepaused = false;
var recordedData = [];
var time;
var uploadFinished = false;
var recordingTime = 151000; //2:31 minutes
var camSettings = {
    video: 
    {
        width: {min:640, ideal:1280, max:1920},
        height: { min: 480, ideal: 720, max: 1080 },
        facingMode: "user"
    }
};

// turn on cam.
camOverlay.addEventListener("click", function ()
{
    AskUserPermission();
});

// change cam (front/back)
changeCam.addEventListener("click", SwitchCams);

//take pic
document.getElementById('takePhoto').addEventListener("click", TakeAPic);

// start/stop recording.
startRec.addEventListener("click", StartRecording);

// pause video while recording.
pauseRec.addEventListener("click", PauseVideo);

// delete video
deleteMedia.addEventListener("click", DeleteMedia);

// show overlay with the pic taken.
previewCanvas.addEventListener("click", function ()
{
    // need to change for a overlay img preview like
    // "open" img
    document.getElementById("prev-img-pop").classList.remove("hide");
    img_prevw.src = imgPrev;
  //  PreviewImage(imgPrev);
});

img_prevw.addEventListener("click", function ()
{
    document.getElementById("prev-img-pop").classList.add("hide");
});

// ask user permission for the cam.
function AskUserPermission()
{
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
    {
        TurnOnCam();
    }
}

function TurnOnCam()
{
    console.log("facing mode: "+camSettings.video.facingMode);
    navigator.mediaDevices.getUserMedia(camSettings).then(function (stream)
    {
        userCamStream = stream;
        EnableMedia();
        // if the cam is on then remove the overlay
        camOverlay.className = "hide";

        recorder = new MediaRecorder(userCamStream);
        video.srcObject = userCamStream;
        video.play();
    });
}

function HandleDataAvaible(event) {
    // recorder.stop();
    recordedData = [];
    deleteMedia.disabled = false;
    pauseRec.disabled = true;
    startRec.className = "fas fa-video";

    if (event.data.size > 0 && isThereAVideo) {
        recordedData.push(event.data);
        VideoPreview();
        isThereAVideo = false;
        videoFile = true;
    }
}
// change cams between back and front cameras. 
function SwitchCams()
{
    var camType = camSettings.video.facingMode.toString();

    if (camType == "environment")
    {
        camType = "user";
        changeCam.innerHTML = "Rear Cam";
    }
    else if (camType == "user")
    {
        camType = "environment";
        changeCam.innerHTML = "Front Cam";
    }

    camSettings.video.facingMode = camType;
    userCamStream.getTracks().forEach(track => { track.stop(); });
    AskUserPermission();
}

function TakeAPic()
{
    //disable video so you can't record when taken.
    startRec.disabled = true;
    //can be deleted
    deleteMedia.disabled = false;
    isThereAPhoto = true;

    mediaType = "pic";

    hiddenCanvas.width = video.videoWidth;
    hiddenCanvas.height = video.videoHeight;
    video = document.getElementById("video");
    contxt = hiddenCanvas.getContext('2d');

    // render to hidden canvas to create the image
    contxt.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

    //convert to image
    image = hiddenCanvas.toDataURL("image/png", 0.7);
    imgPrev = image;

    //show preview image.
    previewCanvas.classList.remove("hide");
    contxt = previewCanvas.getContext("2d");
    contxt.drawImage(video, 0, 0, previewCanvas.width, previewCanvas.height);
    
    image = image.split(","); // get the image data string
    var imgBlob = new Blob([image[1]], { type: "image/png" });
   
    mediaBlob = imgBlob;
    mediaType = "Photos";

    //change label name
    document.getElementById("medialbl").innerText = "Photo name: ";
}

function StartRecording()
{
    //disable photo btn so user can't take a pic when recording
    takePhoto.disabled = true;
    //enable pause, recording can be paused
    pauseRec.disabled = false;
    //showtimer
    recordTime.classList.remove("hide");
    // video time
    startTime = video.currentTime;
    //timer
    video.ontimeupdate = UpdateTime;

    recorder.ondataavailable = HandleDataAvaible;

    if (startRec.className === "fas fa-video")
    {
        recorder.start(recordingTime);
        video.controls = true;
        startRec.className = "far fa-stop-circle";
        startRec.title = "Stop Recoding";
        isThereAVideo = true;
        mediaType = "vid";
    }
    else if (startRec.className === "far fa-stop-circle")
    {
        StopVideo();
    }
}

function PauseVideo()
{
    if (pauseRec.className === "far fa-pause-circle")
    {
        recorder.pause();
        timepaused = true;
        pauseRec.className = "far fa-play-circle";
        pauseRec.title = "Continue Recoding";
        
    }
    else if (pauseRec.className === "far fa-play-circle")
    {
        recorder.resume();
        timepaused = false;
        pauseRec.className = "far fa-pause-circle";
        pauseRec.title = "Pause Recoding";
    }
}

function DeleteMedia()
{
    var media = "video";

    if (isThereAPhoto) {
        image = "";
        media = "photo";
        isThereAPhoto = false;
    }

    if (confirm("Delete " + media + "?")) {
        //delete video file
        recordedData = [];
        videoFile = false;

        // delete photo
        if (media === "photo") {
            image = "";
            previewCanvas.classList.add("hide");
            document.getElementById("prev-img-pop").classList.add("hide");
            contxt.clearRect(0, 0, hiddenCanvas.width, hiddenCanvas.height);
        }

        //change source to user camera
        video.src = null;
        video.srcObject = userCamStream;
        video.controls = false;
        video.play();
        startRec.disabled = false;

        StopVideo();
        EnableMedia();
    }
}

function VideoPreview()
{
    // disable the record btn so we can't take another
    startRec.disabled = true;
    recordTime.classList.add("hide");

    var buffer = new Blob(recordedData, { type: "video/mp4" });
    //console.log(buffer);
    mediaBlob = buffer;
    mediaType = "Videos";

    //change label
    document.getElementById("medialbl").innerText = "Video name: ";
    
    video.srcObject = null;
    console.log(window.URL.createObjectURL(buffer));
    video.src = window.URL.createObjectURL(buffer);
    video.controls = true;
    video.play();
}

function UpdateTime()
{
        var timelapse = video.currentTime - startTime;
        var min = Math.floor(timelapse / 60)
        var sec = timelapse - min * 60;
        time = min + ":" + Math.floor(sec);

        if (timelapse > 0) {
            recordTime.innerHTML = "0" + time + " /2:30";
        }
    
}

function StopVideo()
{
    if (startRec.title === "Stop Recoding")
    {
        recorder.stop();
        startRec.className = "fas fa-video";
        startRec.title = "Start Recoding";
    }
}

function UploadMedia(mediaName)
{
    var formdt = new FormData();
    var mediaExtention;

    if (mediaType === "Videos")
    {
       // mediaName = mediaName + ".mp4";
        mediaExtention = ".mp4";
        
    }
    else if (mediaType === "Photos")
    {
        //mediaName = mediaName + ".png";
        mediaExtention = ".png";
        formdt.append("imgData", image[1]);
    }

    formdt.append('fname', mediaName);
    formdt.append('ext', mediaExtention);
    formdt.append("mediatype", mediaType);
    formdt.append("data", mediaBlob);

    SaveToServer(formdt);
}

function SaveToServer(formData)
{
    var sbm = false;
    $.ajax({
      type: 'POST',
      url: "VideoUploader.aspx",
      data: formData,
      processData: false,
        contentType: false,
        success: function (result) { console.log(mediaType + " uploaded."); validation = true; sbm = true; },
        error: function (result) { console.log(result); alert("An Error ocurred while trying to upload the " + mediaType); validation = false; }
    }).done(function (data) { SimulateClick(sbm); });    
    
}

//can take picture or video.
function EnableMedia()
{
    takePhoto.disabled = false;
    startRec.disabled = false;

    pauseRec.disabled = true;
    deleteMedia.disabled = true;
}

function GetTime(time)
{
    var min = math.floor(time / 60)
    var sec = time - min * 60;
    time = min + ":" + sec;
    return time;
}

function MediaAvailable()
{
    console.log("video: " + videoFile + " img: " + isThereAPhoto);
    if (videoFile || isThereAPhoto)
    {
        return true;
    }
    return false;
}

//});
