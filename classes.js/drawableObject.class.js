class DrawableObject {
    x = 90;
    y = 135;
    img;
    width = 150;
    height = 300;
    imageCache = [];
    currentImage = 0;

  /**
   * Zeichnet das Objekt auf den Canvas
   * @param {CanvasRenderingContext2D} ctx - Der Canvas-Rendering-Kontext
   */
  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);  }
  /**
   * Lädt ein einzelnes Bild von einem Pfad
   * @param {string} path - Pfad zur Bilddatei
   */
  loadImage(path) {
    this.img = new Image();
    this.img.src = path;  }
  /**
   * Lädt mehrere Bilder und speichert sie im imageCache
   * @param {string[]} arr - Array mit Bildpfaden
   */
  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }
}
