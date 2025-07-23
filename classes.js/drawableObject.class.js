class DrawableObject {
    x = 90;
    y = 135;
    img;
    width = 150;
    height = 300;
    imageCache = [];
    currentImage = 0;

  /**
   * Draws the object on the canvas
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
   */
  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);  }

  /**
   * Loads a single image from a path
   * @param {string} path - Path to the image file
   */
  loadImage(path) {
    this.img = new Image();
    this.img.src = path;  }

  /**
   * Loads multiple images and stores them in imageCache
   * @param {string[]} arr - Array with image paths
   */
  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }
}
