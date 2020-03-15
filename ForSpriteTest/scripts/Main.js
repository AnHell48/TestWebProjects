"use strict"
window.addEventListener("load", function(){

  var canvas, cntxt, SCREEN;
  var board;

  function Init()
  {
    canvas = document.getElementById("daCanvas");
    SCREEN = { W: canvas.width, H: canvas.height };
    cntxt = canvas.getContext("2d");


    board = new Sprite(0, 0, 0, 0);
  }

  function Load()
  {
    board.LoadSingle("content/board.png");
  }

  function Update()
  {

  }

  function Draw()
  {
    board.DrawSprite(cntxt);
  }

  function Loop()
  {
    Update();
    Draw();
    window.requestAnimationFrame(Loop);
  }


  Init();
  Load();
  Loop();

});
