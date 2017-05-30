import THREE from 'n3d-threejs'
import OilCanvas from './canvas/OilCanvas.js'
import OilBrush from './brush/OilBrush.js'

class OilPaint {
  constructor(rdrr) {
    this.rdrr = rdrr;
    this.oldtime = new Date() * 0.001;
    this.newtime = new Date() * 0.001;
    this.deltime = 0.0;

    this.camera = new THREE.Camera();
    this.canvas = new OilCanvas();
    this.brush = new OilBrush();

    this.canvas.add(this.brush);
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
