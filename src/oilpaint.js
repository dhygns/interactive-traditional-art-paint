import THREE from 'n3d-threejs'
import OilCanvas from './canvas/OilCanvas.js'
import OilBrush from './brush/OilBrush.js'

class OilPaint {
  constructor(rdrr) {
    this.rdrr = rdrr;
    this.oldtime = new Date() * 0.001;
    this.newtime = new Date() * 0.001;
    this.deltime = 0.0;

    // this.camera = new THREE.Camera();
    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
    this.camera.position.z = 10.0;
    this.canvas = new OilCanvas();
    // this.brush = new OilBrush();
    this.tl = new THREE.TextureLoader();
    this.tl.load("img/Marry.jpg", (img) => {
      img.minFilter = THREE.LinearFilter;
      img.magFilter = THREE.LinearFilter;
      for(var cnt = 0; cnt < 50; cnt++) this.canvas.add(new OilBrush(img));
    })
  }

  update() {
    this.newtime = new Date() * 0.001;
    this.deltime = this.newtime - this.oldtime;
    this.oldtime = new Date() * 0.001;

    if(this.deltime < 0.0 || this.deltime > 1.0) this.deltime = 0.0;

    // console.log(this.canvas)
    this.canvas.update(this.deltime);

  }

  render() {
    this.canvas.render(this.rdrr, this.camera);
    // console.log(this.canvas.texture);
  }
}

export default OilPaint
