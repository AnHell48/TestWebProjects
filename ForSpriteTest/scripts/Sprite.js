/* By: Angel A. Robles | 2019 */
"use strict"
class Sprite
{
  posX; posY;
  speedX; speedY;
  width; height;
  spriteImg; spriteImgRows; spriteImgColumns;
  onTheGround; gravity;

  constructor(xPos, yPos, xSpeed, ySpeed)
  {
    this.posX = xPos;
    this.posY = yPos;
    this.speedX = xSpeed;
    this.speedY = ySpeed;
    this.spriteImg = new Image();

    this.onTheGround = true;
    // console.log("sprite created");
  }

  LoadSingle(fileName)
  {
    this.spriteImg.src = fileName;
    // console.log("test");
  }

  LoadSheet(fileName, rows, columns)
  {
    this.spriteImg.src = fileName;
    this.spriteImgRows= rows;
    this.spriteImgColumns = columns;
  }

  ScreenBounds(screenSize)
  {
    if(this.posX <= 0 )
    {
      this.posX = 1;
    }

    if (this.posX >= screenSize.width)
    {
      // console.log('edge');
      this.posX = screenSize.width ;
    }

    if(this.posY <= 0)
    {
      this.posY = 1;
    }

    if(this.posY >= screenSize.height)
    {
      this.posY = screenSize.height - 30;
    }

  }

  DrawSprite(context)
  {
      this.width = this.spriteImg.width;
      this.height = this.spriteImg.height;

      //draw single sprite
      context.drawImage(this.spriteImg, this.posX, this.posY);
  }

  DrawSpriteSheet(context, sheetSquareX, sheetSquareY, sheetSquareW, sheetSquareH, spritePosX, spritePosY, spriteW, spriteY)
  {
    this.width = this.spriteImg.width / this.spriteImgRows;
    this.height = this.spriteImg.height / this.spriteImgColumns;

    // sx, sy = "square" on the image. What's going to be selected on the img
    context.drawImage(this.spriteImg, sheetSquareX, sheetSquareY, sheetSquareW, sheetSquareH, spritePosX, spritePosY, spriteW, spriteY  );
  }

}
